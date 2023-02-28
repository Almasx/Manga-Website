import { protectedProcedure, publicProcedure, router } from "../trpc";

import { checkChapter } from "lib/queries/checkChapter";
import { checkComics } from "lib/queries/checkComics";
import { handleQuery } from "server/common/handle-query";
import { s3CreatePresignedUrl } from "lib/aws/s3-presigned-url";
import { z } from "zod";

export const chapterRouter = router({
  getChapter: publicProcedure
    .input(
      z.object({
        chapterId: z.string({ required_error: "Chapter id is required" }),
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .query(async ({ input }) => {
      const { comicsId, chapterId } = input;

      const chapter = await handleQuery(
        checkChapter({ pages: true }, chapterId, comicsId)
      );
      return chapter;
    }),

  postChapter: protectedProcedure
    .input(
      z.object({
        comicsId: z.string({ required_error: "Comics id is required" }),
        volumeIndex: z.number({ required_error: "Volume is required" }),
        chapterIndex: z.number({ required_error: "Volume is required" }),
        pagesLenght: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { volumeIndex, chapterIndex, comicsId, pagesLenght } = input;
      await handleQuery(checkComics({ chapters: true }, { id: comicsId }));

      const chapter = await ctx.prisma.chapter.create({
        include: { pages: true },
        data: {
          volumeIndex,
          chapterIndex,
          comicsId,
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
    }),
});
