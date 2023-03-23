import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "server/api/trpc";
import { knockClient, workflows } from "lib/knock/knock-config";

import { TRPCError } from "@trpc/server";
import { checkChapter } from "lib/queries/checkChapter";
import { checkComics } from "lib/queries/checkComics";
import { getChapter } from "lib/queries/getChapter";
import { handleQuery } from "utils/handle-query";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

export const chapterRouter = createTRPCRouter({
  getLikes: publicProcedure
    .input(
      z.object({
        chapterId: z.string({ required_error: "Chapter id is required" }),
      })
    )
    .query(async ({ input: { chapterId }, ctx }) => {
      const chapter = await handleQuery(
        getChapter(
          {
            likes: true,
          },
          chapterId
        )
      );
      return {
        likes: chapter.likes.length,
        ...(ctx.session?.user?.id && {
          likedByUser: !!chapter.likes.find(
            (like) => like.authorId === ctx.session?.user?.id
          ),
        }),
      };
    }),

  postLike: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .mutation(async ({ input: { chapterId }, ctx }) => {
      const chapter = await handleQuery(getChapter({ likes: true }, chapterId));
      const likedByUser = chapter.likes.find(
        (like) => like.authorId === ctx.session?.user?.id
      );
      if (!!likedByUser) {
        await ctx.prisma.chapterLike.delete({ where: { id: likedByUser.id } });
      } else {
        await ctx.prisma.chapterLike.create({
          data: {
            author: { connect: { id: ctx.session.user.id } },
            chapter: { connect: { id: chapterId } },
          },
        });
      }
    }),

  getComments: publicProcedure
    .input(
      z.object({
        chapterId: z.string({ required_error: "Chapter id is required" }),
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(
      async ({ input: { chapterId, comicsId } }) =>
        await handleQuery(
          checkChapter(
            {
              comments: {
                include: { author: true },
                orderBy: { createdAt: "desc" },
              },
            },
            chapterId,
            comicsId
          )
        )
    ),

  postComment: protectedProcedure
    .input(z.object({ chapterId: z.string(), content: z.string() }))
    .mutation(async ({ input: { chapterId, content }, ctx }) => {
      await handleQuery(getChapter({}, chapterId));
      await ctx.prisma.chapterComment.create({
        data: {
          content,
          author: { connect: { id: ctx.session.user.id } },
          chapter: { connect: { id: chapterId } },
        },
      });
    }),

  getRatingComment: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ input: { commentId }, ctx }) => {
      const comment = await ctx.prisma.chapterComment.findUnique({
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
      await ctx.prisma.chapterComment.update({
        where: { id: commentId },
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
    }),

  getChapter: publicProcedure
    .input(
      z.object({
        chapterId: z.string({ required_error: "Chapter id is required" }),
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(async ({ input: { comicsId, chapterId } }) => {
      const chapter = await handleQuery(
        checkChapter({ pages: true }, chapterId, comicsId)
      );
      return chapter;
    }),

  postChapter: protectedProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
        volumeIndex: z.number({ required_error: "Volume index is required" }),
        chapterIndex: z.number({ required_error: "Chapter index is required" }),
        title: z.string({ required_error: "Title is required" }),
        publicAt: z.date().optional(),
        pagesLenght: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comics = await handleQuery(
        checkComics(
          {
            chapters: true,
            bookmarks: { select: { user: { select: { knockId: true } } } },
            title: true,
          },
          { id: input.comicsId }
        )
      );

      const chapter = await ctx.prisma.chapter.create({
        include: { pages: true },
        data: {
          ...input,
          pages: { createMany: { data: Array(input.pagesLenght).fill({}) } },
        },
      });

      knockClient.workflows.trigger(workflows.chapterPublication, {
        recipients: comics.bookmarks
          .map((bookmark) => bookmark.user.knockId)
          .filter((knockId) => knockId !== null) as string[],
        data: {
          chapterIndex: chapter.chapterIndex,
          comics: comics.title,
        },
      });

      return Promise.all(
        chapter.pages.map((page) => {
          const url = s3CreatePresignedUrl(
            `${input.comicsId}/volume_${chapter.volumeIndex}_chapter_${chapter.chapterIndex}/${page.id}`
          );
          console.log(url);
          return url;
        })
      );
    }),

  deleteChapters: protectedProcedure
    .input(
      z.object({
        chapterIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input: { chapterIds }, ctx }) => {
      await ctx.prisma.chapter.deleteMany({
        where: { id: { in: chapterIds } },
      });
    }),
});
