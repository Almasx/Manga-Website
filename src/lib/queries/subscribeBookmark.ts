import type { Context } from "server/api/trpc";

export async function subscribeComicsAndBookmarks(
  ctx: Context,
  comicsId: string,
  bookmarkId: string
) {
  const bookmark = await ctx.prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    include: { comics: true },
  });

  const comics = await ctx.prisma.comics.findUnique({
    where: { id: comicsId },
    include: { bookmarks: true },
  });

  // To notify users at new publication
  if (comics && bookmark) {
    await ctx.prisma.comics.update({
      where: { id: comicsId },
      data: {
        bookmarks: {
          connect: { id: bookmark.id },
        },
      },
    });
    await ctx.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        comics: {
          connect: { id: comics.id },
        },
      },
    });
  }
}
