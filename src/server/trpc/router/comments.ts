import { protectedProcedure, router } from "../trpc";

import { checkComics } from "lib/queries/checkComics";
import { handleQuery } from "server/common/handle-query";
import { z } from "zod";

export const commentsRouter = router({
  postCommentOnComics: protectedProcedure
    .input(z.object({ comicsId: z.string(), content: z.string() }))
    .mutation(async ({ input: { comicsId, content }, ctx }) => {
      await handleQuery(checkComics({ id: true }, { id: comicsId }));
      await ctx.prisma.comicsComment.create({
        data: {
          content,
          author: { connect: { id: ctx.session.user.id } },
          comics: { connect: { id: comicsId } },
        },
      });
    }),

  postCommentOnChapter: protectedProcedure
    .input(z.object({ chapterId: z.string(), content: z.string() }))
    .mutation(async ({ input: { chapterId, content }, ctx }) => {
      await handleQuery(checkComics({ id: true }, { id: chapterId }));
      await ctx.prisma.chapterComment.create({
        data: {
          content,
          author: { connect: { id: ctx.session.user.id } },
          chapter: { connect: { id: chapterId } },
        },
      });
    }),
});
