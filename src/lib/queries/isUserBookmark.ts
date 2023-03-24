import type { Context } from "server/api/trpc";

export async function isUserBookmark(ctx: Context, bookmarkId: string) {
  const userBookmarks = await ctx.prisma.user
    .findUnique({
      where: { id: ctx.session?.user.id },
      include: { bookmarks: true },
    })
    .then((user) => ({
      ...user,
      bookmarks: user?.bookmarks.map((bookmark) => bookmark.id) ?? [],
    }));

  if (!userBookmarks.bookmarks.includes(bookmarkId)) {
    return {
      status: "error" as const,
      code: "BAD_REQUEST" as const,
      message: "Bookmarks isn't users one",
    };
  }

  return {
    status: "success" as const,
    data: userBookmarks,
  };
}
