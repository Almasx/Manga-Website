import prisma from "server/db/client";

export async function isUserBookmark(userId: string, bookmarkId: string) {
  const userBookmarks = await prisma.user
    .findUnique({
      where: { id: userId },
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
