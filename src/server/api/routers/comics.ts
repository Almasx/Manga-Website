import {
  checkComics,
  defaultCheckComicsSelect,
  notExistComics,
} from "lib/queries/checkComics";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "server/api/trpc";
import { knockClient, workflows } from "lib/knock/knock-config";

import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { handleQuery } from "utils/handle-query";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

const comicsRouter = createTRPCRouter({
  getGenres: publicProcedure.query(({ ctx }) => ctx.prisma.genre.findMany()),

  getComments: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(
      async ({ input: { comicsId }, ctx }) =>
        await handleQuery(
          checkComics(
            ctx,
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

  postComment: protectedProcedure
    .input(z.object({ comicsId: z.string(), content: z.string() }))
    .mutation(async ({ input: { comicsId, content }, ctx }) => {
      await ctx.prisma.comicsComment.create({
        data: {
          content,
          author: { connect: { id: ctx.session.user.id } },
          comics: { connect: { id: comicsId } },
        },
      });
    }),

  getRatingComment: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ input: { commentId }, ctx }) => {
      const comment = await ctx.prisma.comicsComment.findUnique({
        select: { upVote: true, downVote: true },
        where: { id: commentId },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      return comment.upVote - comment.downVote;
    }),

  postRatingComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        vote: z.enum(["upvote", "downvote"]),
        votedState: z.boolean().default(false),
      })
    )
    .mutation(async ({ input: { commentId, vote, votedState }, ctx }) => {
      const comment = await ctx.prisma.comicsComment.update({
        where: { id: commentId },
        select: { author: { select: { knockId: true } }, content: true },
        data: {
          ...(vote === "upvote"
            ? {
                upVote: {
                  increment: 1 + Number(votedState),
                },
              }
            : {
                downVote: {
                  increment: 1 + Number(votedState),
                },
              }),
        },
      });
      comment.author.knockId &&
        knockClient.workflows.trigger(workflows.rateComment, {
          recipients: [comment.author.knockId],
          data: {
            comment_body: comment.content,
            variableKey: "Rated on comics",
          },
        });
    }),

  getChapters: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
        order: z.enum(["asc", "desc"]).default("asc"),
      })
    )
    .query(async ({ input: { comicsId, order }, ctx }) => {
      const chapters = await handleQuery(
        checkComics(
          ctx,
          {
            chapters: {
              select: {
                chapterIndex: true,
                volumeIndex: true,
                createdAt: true,
                id: true,
                title: true,
                publicAt: true,
                _count: { select: { pages: true } },
              },
              orderBy: [{ volumeIndex: order }, { chapterIndex: order }],
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
        limit: z.number().min(2).max(30).default(10),
        cursor: z.string().nullish(),
        query: z.string().default(""),
        status: z.nativeEnum(Status).nullish(),
        sort: z.enum(["saved", "year", "ratings"]).default("year"),
        genres: z.array(z.string()).default([]),
        order: z.enum(["asc", "desc"]).default("asc"),
      })
    )
    .query(
      async ({
        input: { cursor, query, status, sort, order, limit, genres },
        ctx,
      }) => {
        const catalog = await ctx.prisma.comics.findMany({
          select: {
            thumbnail: true,
            title: true,
            title_ru: true,
            id: true,
            ratings: true,
          },
          where: {
            ...(genres.length !== 0 && {
              genres: { some: { id: { in: genres } } },
            }),
            ...(status && { status }),
            title: { contains: query },
          },
          orderBy: {
            [sort === "saved" ? "bookmarks" : sort]: [
              "ratings",
              "saved",
            ].includes(sort)
              ? { _count: order }
              : order,
          },
          cursor: cursor ? { id: cursor } : undefined,
          take: limit + 1,
        });
        let nextId: string | undefined = undefined;
        if (catalog.length > limit) {
          const nextItem = catalog.pop(); // return the last item from the array
          nextId = nextItem?.id;
        }
        return {
          catalog,
          nextId,
        };
      }
    ),

  getRecommendedComics: publicProcedure
    .input(
      z.object({
        genres: z.array(z.string()).default([]),
      })
    )
    .query(async ({ input: { genres }, ctx }) => {
      const recommendation = await ctx.prisma.comics.findMany({
        where: {
          ...(genres.length !== 0 && {
            genres: { some: { id: { in: genres } } },
          }),
        },
        include: { ratings: true, thumbnail: true },
        take: 5,
      });

      return recommendation.map((comics) => ({
        ...comics,
        rating:
          comics.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          comics.ratings.length,
      }));
    }),

  getComics: publicProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(async ({ input: { comicsId }, ctx }) => {
      const comics = await handleQuery(
        checkComics(ctx, defaultCheckComicsSelect, { id: comicsId })
      );

      const user =
        ctx.session?.user?.id &&
        (await ctx.prisma.user.findUnique({
          where: { id: ctx.session?.user?.id },
          select: { chaptersRead: true },
        }));

      console.log(user && user.chaptersRead, ctx.session?.user?.id);

      return {
        ...comics,
        chapters: comics.chapters.map((chapter) => ({
          ...chapter,
          read: user
            ? !!user.chaptersRead.find(
                (chapterRead) => chapterRead.id === chapter.id
              )
            : false,
        })),

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
        ratingLength: comics.ratings.length,
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

      await handleQuery(
        notExistComics(ctx, defaultCheckComicsSelect, { title })
      );
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
        checkComics(ctx, defaultCheckComicsSelect, { id })
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
