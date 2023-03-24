import type { Context } from "server/api/trpc";
import type { Prisma } from "@prisma/client";

export async function getChapter<S extends Prisma.ChapterInclude>(
  ctx: Context,
  include: Prisma.Subset<S, Prisma.ChapterInclude>,
  chapterId: string
) {
  const chapter = await ctx.prisma.chapter.findUnique<{
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

  return {
    status: "success" as const,
    data: chapter,
  };
}
