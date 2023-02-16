import prisma from "server/db/client";

export async function checkBookmark(bookmarkId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    select: { comics: true },
    where: { id: bookmarkId },
  });

  if (!bookmark) {
    return {
      status: "error" as const,
      code: "NOT_FOUND" as const,
      message: "bookmark not found",
    };
  }

  return {
    status: "success" as const,
    data: bookmark,
  };
}
