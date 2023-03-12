import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getBookmarks: protectedProcedure.query(({ ctx }) => {
    const bookmarks = ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { bookmarks: true },
    });
    return bookmarks;
  }),
});
