import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

import { z } from "zod";

export const userRouter = createTRPCRouter({
  getBookmarks: protectedProcedure.query(({ ctx }) => {
    const bookmarks = ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { bookmarks: true },
    });
    return bookmarks;
  }),

  readChapter: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(({ input: { chapterId }, ctx }) =>
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          chaptersRead: { connect: { id: chapterId } },
        },
      })
    ),
});
