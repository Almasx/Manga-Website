import { protectedProcedure, publicProcedure, router } from "../trpc";

import { checkChapter } from "lib/queries/checkChapter";
import { checkComics } from "lib/queries/checkComics";
import { getChapter } from "lib/queries/getChapter";
import { handleQuery } from "server/common/handle-query";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

export const chapterRouter = router({
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
    .mutation(
      async ({
        input: {
          volumeIndex,
          chapterIndex,
          comicsId,
          pagesLenght,
          title,
          publicAt,
        },
        ctx,
      }) => {
        await handleQuery(checkComics({ chapters: true }, { id: comicsId }));

        const chapter = await ctx.prisma.chapter.create({
          include: { pages: true },
          data: {
            publicAt,
            volumeIndex,
            chapterIndex,
            comicsId,
            title,
            pages: { createMany: { data: Array(pagesLenght).fill({}) } },
          },
        });

        return Promise.all(
          chapter.pages.map((page) => {
            const url = s3CreatePresignedUrl(
              `${comicsId}/volume_${chapter.volumeIndex}_chapter_${chapter.chapterIndex}/${page.id}`
            );
            console.log(url);
            return url;
          })
        );
      }
    ),
});
