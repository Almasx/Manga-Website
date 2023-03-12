import {
  checkComics,
  defaultCheckComicsSelect,
  notExistComics,
} from "lib/queries/checkComics";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import type { Prisma } from "@prisma/client";
import { Status } from "@prisma/client";
import { handleQuery } from "server/common/handle-query";
import { propertyOf } from "utils/property-of";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

type ComicsWithRatings = Prisma.ComicsGetPayload<{
  include: { ratings: true };
}>;

const comicsRouter = router({
  getGenres: publicProcedure.query(({ ctx }) => ctx.prisma.genre.findMany()),

  getComments: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(
      async ({ input: { comicsId } }) =>
        await handleQuery(
          checkComics(
            {
              comments: {
                include: { author: true },
                orderBy: { createdAt: "desc" },
              },
            },
            { id: comicsId }
          )
        )
    ),

  getChapters: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(async ({ input: { comicsId } }) => {
      const chapters = await handleQuery(
        checkComics(
          {
            chapters: {
              select: {
                chapterIndex: true,
                volumeIndex: true,
                createdAt: true,
                id: true,
                title: true,
              },
            },
          },
          { id: comicsId }
        )
      );
      return chapters;
    }),

  getCatalog: publicProcedure
    .input(
      z.object({
        limit: z.number().min(2).max(30).nullish(),
        cursor: z.string().nullish(),
        query: z.string().default(""),
        status: z.nativeEnum(Status).default("ongoing"),
        sort: z
          .enum([
            propertyOf<ComicsWithRatings>("saved"),
            propertyOf<ComicsWithRatings>("year"),
            propertyOf<ComicsWithRatings>("ratings"),
          ])
          .default("year"),
        genres: z.array(z.string()).default([]),
        order: z.enum(["asc", "desc"]).default("asc"),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, query, status, sort, order } = input;
      const limit = input.limit ?? 10;

      const catalog = await ctx.prisma.comics.findMany({
        select: {
          thumbnail: true,
          title: true,
          title_ru: true,
          id: true,
          ratings: true,
        },
        where: {
          ...(input.genres.length !== 0 && {
            genres: { some: { id: { in: input.genres } } },
          }),
          status: status,
          title: { contains: query },
        },
        orderBy: {
          [sort]: sort === "ratings" ? { _count: order } : order,
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit,
      });

      return {
        catalog,
        nextId: catalog.length === limit ? catalog[1]?.id : undefined,
      };
    }),

  getComics: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(async ({ input }) => {
      const { comicsId } = input;
      const comics = await handleQuery(
        checkComics(defaultCheckComicsSelect, { id: comicsId })
      );

      return {
        ...comics,
        status:
          comics.status === "ongoing"
            ? "Выпускается"
            : comics.status === "abandoned"
            ? "Заброшен"
            : "Завершен",
        ratings:
          comics.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          comics.ratings.length,
        saved: comics.bookmarks.length,
      };
    }),

  postComics: protectedProcedure
    .input(
      z.object({
        title: z.string({ required_error: "title is required" }),
        title_ru: z.string({ required_error: "title_ru is required" }),
        description: z.string({ required_error: "description is required" }),
        status: z.enum(["ongoing", "abandoned", "finished"]).default("ongoing"),
        genres: z.array(z.string()),
        year: z.number({ required_error: "year is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, title_ru, status, year, genres, description } = input;

      await handleQuery(notExistComics(defaultCheckComicsSelect, { title }));
      const comics = await ctx.prisma.comics.create({
        include: { thumbnail: true },
        data: {
          title,
          title_ru,
          status,
          year,
          genres: {
            connect: [...genres.map((genreId) => ({ id: genreId }))],
          },
          description,
          thumbnail: { create: {} },
        },
      });

      return s3CreatePresignedUrl(
        `thumbnails/${comics.thumbnail?.id as string}`
      );
    }),

  putComics: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        title_ru: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["ongoing", "abandoned", "finished"]).optional(),
        genres: z.array(z.string()).optional(),
        year: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, title_ru, status, year, genres, description, id } = input;

      const comics = await handleQuery(
        checkComics(defaultCheckComicsSelect, { id })
      );
      await ctx.prisma.comics.update({
        where: { id },
        include: { thumbnail: true },
        data: {
          title,
          title_ru,
          status,
          year,
          description,
          ...(genres && {
            genres: { set: genres.map((genre) => ({ id: genre })) },
          }),
        },
      });

      return s3CreatePresignedUrl(
        `thumbnails/${comics.thumbnail?.id as string}`
      );
    }),
});

export default comicsRouter;
