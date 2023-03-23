import { prisma } from "server/db";

export async function subscribeComicsAndBookmarks(
  comicsId: string,
  bookmarkId: string
) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    include: { comics: true },
  });

  const comics = await prisma.comics.findUnique({
    where: { id: comicsId },
    include: { bookmarks: true },
  });

  // To notify users at new publication
  if (comics && bookmark) {
    await prisma.comics.update({
      where: { id: comicsId },
      data: {
        bookmarks: {
          connect: { id: bookmark.id },
        },
      },
    });
    await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        comics: {
          connect: { id: comics.id },
        },
      },
    });
  }
}
