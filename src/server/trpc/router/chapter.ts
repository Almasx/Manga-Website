import { protectedProcedure, publicProcedure, router } from "../trpc";

import { checkChapter } from "lib/queries/checkChapter";
import { checkComics } from "lib/queries/checkComics";
import { handleQuery } from "server/common/handle-query";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

export const chapterRouter = router({
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
