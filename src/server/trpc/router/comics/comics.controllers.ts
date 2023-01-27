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
const UPLOADING_TIME_LIMIT = 30;
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
        chapters: {
          select: {
            id: true,
            volume: true,
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

  const chapterExist = comics.chapters.some(
    (chapter) => chapter.id === chapterId
  );

  // Check for chapter in comics
  if (chapterExist) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chapter not found",
    });
  }

  const chapter = await ctx.prisma.chapter.findUnique({
    where: { id: chapterId },
  });
  return chapter;
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
  const { volume, comicsId, pages } = input;

  let comics = await ctx.prisma.comics.findUnique({
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

  // eslint-disable-next-line prefer-const
  let chapter = await ctx.prisma.chapter.create({
    data: {
      volume: volume,
      comicsId: comicsId,
    },
  });

  // const uploadPath = path.join(
  //   __dirname,
  //   "../../",
  //   process.env.UPLOAD_CHAPTER,
  //   chapter.id.toString()
  // );

  // Save file in storage
  // const images = [];
  // fs.mkdirSync(uploadPath);
  // for (let i = 1; i <= pages.length; i++) {
  //   const pagePath = path.join(uploadPath, i.toString() + ".jpeg");
  //   const pageURI = `http://localhost:3000/uploads/chapter/${chapter.id.toString()}/pages/${i.toString()}`;

  //   await sharp(pages[i - 1].buffer)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toFile(pagePath);
  //   images.push(pageURI);
  // }

  // chapter = await ctx.prisma.chapter.update({
  //   where: { id: chapter.id },
  //   data: { images: { set: images } },
  // });
  comics = await ctx.prisma.comics.update({
    select: { chapters: true },
    where: { id: comicsId },
    data: {
      chapters: {
        set: [...comics.chapters, chapter],
      },
    },
  });
  return chapter;
};
