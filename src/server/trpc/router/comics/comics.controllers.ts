import type {
  GetCatalogSchema,
  GetChapterSchema,
  GetComicsSchema,
  PostChapterSchema,
  PostComicsSchema,
} from "./comics.schema";
import { TRPCError } from "@trpc/server";
import type { Context } from "../../context";
import { env } from "../../../../env/server.mjs";
import { AWS } from "../../../../libs/aws-config";

const s3 = new AWS.S3();
const UPLOADING_TIME_LIMIT = 600;
const UPLOAD_MAX_FILE_SIZE = 1000000;

// @desc    Get & Filter/Sort Catalog
// @route   GET /api/comics
// @access  public
export const getCatalog = async ({
  input,
  ctx,
}: {
  input: GetCatalogSchema;
  ctx: Context;
}) => {
  // Get all genres
  const genre_db = (await ctx.prisma.genre.findMany({})).map(
    (genre) => genre.id
  );

  // Decontruct query
  const { cursor, query, status, sort, order } = input;
  const genres = input.genres.length === 0 ? genre_db : input.genres;
  const limit = input.limit ?? 10;

  const catalog = await ctx.prisma.comics.findMany({
    select: {
      chapters: false,
      description: false,
      thumbnail: true,
      title: true,
      title_ru: true,
      id: true,
      rating: true,
    },
    where: {
      genres: { some: { id: { in: genres } } },
      status: status,
      title: { contains: query },
    },
    orderBy: {
      [sort]: order,
    },
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
  });

  return {
    catalog,
    nextId: catalog.length === limit ? catalog[1]?.id : undefined,
  };
};

// @desc    Get information about comics
// @route   Get /api/comics/:comics_id/
// @access  public
export const getComics = async ({
  input,
  ctx,
}: {
  input: GetComicsSchema;
  ctx: Context;
}) => {
  const { comicsId } = input;
  const comics = await ctx.prisma.comics
    .findUnique({
      select: {
        title: true,
        title_ru: true,
        description: true,
        status: true,
        genres: true,
        thumbnail: true,
        chapters: {
          select: {
            chapterIndex: true,
            volumeIndex: true,
            createdAt: true,
          },
        },
      },
      where: { id: comicsId },
    })
    .then((comics) => ({
      ...comics,
      year: 2000,
      rating: 3,
      saved: 10000,
      genres: comics && comics.genres.map((genre) => genre.title),
    }));

  // Check comics
  if (!comics) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comics not found",
    });
  }

  return comics;
};

// @desc    Open Chapter
// @route   Get /api/comics/:comics_id/chapter/:chapter_id
// @access  public/private
export const getChapter = async ({
  input,
  ctx,
}: {
  input: GetChapterSchema;
  ctx: Context;
}) => {
  const { comicsId, chapterId } = input;

  const comics = await ctx.prisma.comics.findUnique({
    select: { title: true, title_ru: true, chapters: true },
    where: { id: comicsId },
  });

  // Validate comics
  if (!comics) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comics not found",
    });
  }

  // const chapterExist = comics.chapters.some(
  //   (chapter) => chapter.id === chapterId
  // );

  // // Check for chapter in comics
  // if (chapterExist) {
  //   throw new TRPCError({
  //     code: "NOT_FOUND",
  //     message: "Chapter not found",
  //   });
  // }

  // const chapter = await ctx.prisma.chapter.findUnique({
  //   where: { id: chapterId },
  // });
  // return chapter;
};

// @desc    Create New Comics
// @route   POST /api/comics/
// @access  private
export const postComics = async ({
  input,
  ctx,
}: {
  input: PostComicsSchema;
  ctx: Context;
}) => {
  const { title, title_ru, status, year, genres, description } = input;
  console.log([...genres.map((genreId) => ({ id: genreId }))]);

  const comicsExist = !!(await ctx.prisma.comics.findUnique({
    where: { title: title },
  }));

  // Check for chapter in comics
  if (comicsExist) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Comics already exists",
    });
  }

  const comics = await ctx.prisma.comics.create({
    include: { thumbnail: true },
    data: {
      title,
      title_ru,
      status,
      year,
      genres: {
        connect: [...genres.map((genreId) => ({ id: genreId }))],
      },
      description,
      thumbnail: { create: {} },
    },
  });

  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Fields: {
          key: `thumbnails/${comics.thumbnail?.id}`,
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
        Expires: UPLOADING_TIME_LIMIT,
        Bucket: env.AWS_BUCKET_NAME,
      },
      (err, signed) => {
        if (err) return reject(err);
        resolve(signed);
      }
    );
  });
};

// @desc    Add new Chapter
// @route   POST /api/comics/:comics_id/chapter
// @access  private
export const postChapter = async ({
  input,
  ctx,
}: {
  input: PostChapterSchema;
  ctx: Context;
}) => {
  const { volumeIndex, chapterIndex, comicsId, pagesLenght } = input;

  const comics = await ctx.prisma.comics.findUnique({
    where: { id: comicsId },
    select: { chapters: true },
  });

  // Validate comics
  if (!comics) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chapter not found",
    });
  }

  const chapter = await ctx.prisma.chapter.create({
    include: { pages: true },
    data: {
      volumeIndex,
      chapterIndex,
      comicsId,
      pages: { createMany: { data: Array(pagesLenght).fill({}) } },
    },
  });

  return Promise.all(
    chapter.pages.map(
      (page) =>
        new Promise((resolve, reject) => {
          s3.createPresignedPost(
            {
              Fields: {
                key: `${comicsId}/volume_${chapter.volumeIndex}_chapter_${chapter.chapterIndex}/${page.id}`,
              },
              Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
              ],
              Expires: UPLOADING_TIME_LIMIT,
              Bucket: env.AWS_BUCKET_NAME,
            },
            (err, signed) => {
              if (err) return reject(err);
              resolve(signed);
            }
          );
        })
    )
  );
};
