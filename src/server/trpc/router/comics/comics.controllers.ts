import type {
  GetCatalogSchema,
  GetChapterSchema,
  GetComicsSchema,
  PostChapterSchema,
  PostComicsSchema,
} from "./comics.schema";
import { TRPCError } from "@trpc/server";
import type { Context } from "../../context";

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
  const genres = input.genres ?? genre_db;
  const limit = input.limit ?? 10;
  input.genres;

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
  try {
    // Get genres _id
    for await (const [index, name] of genres.entries()) {
      const genre = await ctx.prisma.genre.findFirst({
        where: { title: name },
      });
      genres[index] = genre?.id.toString();
    }

    const comics = await ctx.prisma.comics.create({
      data: {
        title,
        title_ru,
        status,
        year,
        genres: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          connect: [...genres.map((genre) => ({ id: parseInt(genre!) }))],
        },
        description,
      },
    });

    // Add new thumnail URI to document
    // comics = await ctx.prisma.comics.update({
    //   where: { id: comics.id },
    //   data: { thumbnail: thumbnailURI },
    // });
    return comics;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Comics already exists",
      });
    }
    throw err;
  }
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
