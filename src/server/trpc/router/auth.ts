import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getBookmarks: protectedProcedure.query(({ ctx }) => {
    const bookmarks = ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { bookmarks: true },
    });
    return bookmarks;
  }),
});
