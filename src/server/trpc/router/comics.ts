import {
  checkComics,
  defaultCheckComicsSelect,
  notExistComics,
} from "lib/queries/checkComics";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import type { Comics } from "@prisma/client";
import { Status } from "@prisma/client";
import { checkChapter } from "lib/queries/checkChapter";
import { handleQuery } from "server/common/handle-query";
import { propertyOf } from "utils/property-of";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

const comicsRouter = router({
  getGenres: publicProcedure.query(({ ctx }) => ctx.prisma.genre.findMany()),

  getChapters: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(async ({ input }) => {
      const { comicsId } = input;
      const chapters = await handleQuery(
        checkComics(
          {
            chapters: {
              select: {
                chapterIndex: true,
                volumeIndex: true,
                createdAt: true,
                id: true,
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
            propertyOf<Comics>("saved"),
            propertyOf<Comics>("year"),
            propertyOf<Comics>("rating"),
          ])
          .default("year"),
        genres: z.array(z.string()).default([]),
        order: z.enum(["asc", "desc"]).default("asc"),
      })
    )
    .query(async ({ input, ctx }) => {
      // Get all genres
      const genre_db = (await ctx.prisma.genre.findMany({})).map(
        (genre) => genre.id
      );

      // Decontruct query
      const { cursor, query, status, sort, order } = input;
      const genres = input.genres.length === 0 ? genre_db : input.genres;
      const limit = input.limit ?? 10;

      const catalog = await ctx.prisma.comics.findMany({
        select: {
          chapters: false,
          description: false,
          thumbnail: true,
          title: true,
          title_ru: true,
          id: true,
          rating: true,
        },
        where: {
          genres: { some: { id: { in: genres } } },
          status: status,
          title: { contains: query },
        },
        orderBy: {
          [sort]: order,
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
        year: 2000,
        rating: 3,
        saved: 10000,
        genres: comics && comics.genres.map((genre) => genre.title),
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
});

export default comicsRouter;