import type { Prisma } from "@prisma/client";
import prisma from "server/db/client";

export async function checkChapter<S extends Prisma.ChapterInclude>(
  include: Prisma.Subset<S, Prisma.ChapterInclude>,
  chapterId: string,
  comicsId: string
) {
  const chapter = await prisma.chapter.findUnique<{
    include: S;
    where: { id: string };
  }>({ include, where: { id: chapterId } });

  if (!chapter) {
    return {
      status: "error" as const,
      code: "NOT_FOUND" as const,
      message: "Chapter not found",
    };
  }

  if (chapter.comicsId !== comicsId) {
    return {
      status: "error" as const,
      code: "BAD_REQUEST" as const,
      message: "Chapter isn't comics one",
    };
  }

  return {
    status: "success" as const,
    data: chapter,
  };
}
