import type { Context } from "server/api/trpc";
import { Prisma } from "@prisma/client";

export const defaultCheckComicsSelect = Prisma.validator<Prisma.ComicsSelect>()(
  {
    id: true,
    title: true,
    title_ru: true,
    description: true,
    status: true,
    year: true,
    createdAt: true,
    updatedAt: true,
    ratings: true,
    bookmarks: true,
    external_thumbnail: true,
    chapters: {
      select: {
        publicAt: true,
        chapterIndex: true,
        volumeIndex: true,
        createdAt: true,
        id: true,
        title: true,
        _count: { select: { pages: true } },
      },
    },
    comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
    genres: true,
    thumbnail: true,
  }
);

export async function checkComics<S extends Prisma.ComicsSelect>(
  ctx: Context,
  select: Prisma.Subset<S, Prisma.ComicsSelect>,
  where: Prisma.ComicsWhereUniqueInput
) {
  const comics = await ctx.prisma.comics.findUnique<{
    select: S;
    where: Prisma.ComicsWhereUniqueInput;
  }>({ select, where: where });

  if (!comics) {
    return {
      status: "error" as const,
      code: "NOT_FOUND" as const,
      message: "Comics not found",
    };
  }

  return {
    status: "success" as const,
    data: comics,
  };
}

export async function notExistComics<S extends Prisma.ComicsSelect>(
  ctx: Context,
  select: Prisma.Subset<S, Prisma.ComicsSelect>,
  where: Prisma.ComicsWhereUniqueInput
) {
  const comics = await ctx.prisma.comics.findUnique<{
    select: S;
    where: Prisma.ComicsWhereUniqueInput;
  }>({ select, where: where });

  if (comics) {
    return {
      status: "error" as const,
      code: "BAD_REQUEST" as const,
      message: "Comics already exist",
    };
  }

  return {
    status: "success" as const,
  };
}
