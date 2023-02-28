import { protectedProcedure, router } from "../trpc";

import { checkComics } from "lib/queries/checkComics";
import { handleQuery } from "server/common/handle-query";
import { z } from "zod";

export const commentsRouter = router({
  postCommentOnComics: protectedProcedure
    .input(z.object({ comicsId: z.string(), content: z.string() }))
    .mutation(async ({ input: { comicsId, content }, ctx }) => {
      await handleQuery(checkComics({ id: true }, { id: comicsId }));
      const comment = await ctx.prisma.comicsComment.create({
        data: {
          content,
          author: { connect: { id: ctx.session.user.id } },
          comics: { connect: { id: comicsId } },
        },
      });
    }),
});
