import { Prisma } from "@prisma/client";
import prisma from "server/db/client";

export const defaultCheckComicsSelect = Prisma.validator<Prisma.ComicsSelect>()(
  {
    id: true,
    title: true,
    title_ru: true,
    description: true,
    rating: true,
    saved: true,
    status: true,
    year: true,
    createdAt: true,
    updatedAt: true,
    chapters: {
      select: {
        chapterIndex: true,
        volumeIndex: true,
        createdAt: true,
        id: true,
      },
    },
    genres: true,
    thumbnail: true,
  }
);

export async function checkComics<S extends Prisma.ComicsSelect>(
  select: Prisma.Subset<S, Prisma.ComicsSelect>,
  where: Prisma.ComicsWhereUniqueInput
) {
  const comics = await prisma.comics.findUnique<{
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
  select: Prisma.Subset<S, Prisma.ComicsSelect>,
  where: Prisma.ComicsWhereUniqueInput
) {
  const comics = await prisma.comics.findUnique<{
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
