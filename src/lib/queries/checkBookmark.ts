import type { Prisma } from "@prisma/client";
import prisma from "server/db/client";

export const defaultCheckBookmark: Prisma.BookmarkSelect = {
  userId: false,
  title: true,
  comics: {
    select: {
      id: true,
      title: true,
      title_ru: true,
      updatedAt: true,
      createdAt: true,
      thumbnail: true,
    },
  },
};

export async function checkBookmark(
  bookmarkId: string,
  BookMarkSelect?: Prisma.BookmarkSelect
) {
  const bookmark = await prisma.bookmark.findUnique({
    select: { comics: true, ...BookMarkSelect },
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
