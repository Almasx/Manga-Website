import type { GetBookmarkSchema, PostBookmarkSchema } from "./bookmark.schema";

import { Bookmark } from "@prisma/client";
import type { Comics } from "@prisma/client";
import type { Context } from "../../context";
import { TRPCError } from "@trpc/server";
import { checkBookmark } from "lib/queries/checkBookmark";
import { checkComics } from "lib/queries/checkComics";
import { handleQuery } from "server/common/handle-query";
import { isUserBookmark } from "lib/queries/isUserBookmark";

// @desc    Get Users bookmarks
// @route   GET /api/user/account/bookmarks/:bookmarks_id
// @access  private
export const getBookmark = async ({
  input,
  ctx,
}: {
  input: GetBookmarkSchema;
  ctx: Context;
}) => {
  const { bookmarkId } = input;

  // Bookmarks owned by user

  const userBookmarks = await ctx.prisma.user
    .findUnique({
      where: { id: ctx.session?.user?.id as string },
      include: { bookmarks: true },
    })
    .then((user) => ({
      ...user,
      bookmarks: user?.bookmarks.map((bookmark) => bookmark.id) ?? [],
    }));

  if (!userBookmarks.bookmarks.includes(bookmarkId)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Bookmarks isn't users one",
    });
  }

  // Check bookmarks
  const bookmark = await ctx.prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    select: {
      userId: false,
      title: true,
      comics: {
        select: {
          id: true,
          title: true,
          title_ru: true,
          thumbnail: true,
          updatedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!bookmark) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Bookmarks not found",
    });
  }

  return bookmark;
};

// @desc    Bookmark Comics
// @route   UPDATE /api/user/account/bookmarks/:bookmarks_id
// @access  private
export const bookmarkComics = async ({
  input,
  ctx,
}: {
  input: PostBookmarkSchema;
  ctx: Context;
}) => {
  const { bookmarkId, comicsId } = input;

  try {
    const comics = await handleQuery(checkComics(comicsId));
    const bookmark = await handleQuery(checkBookmark(bookmarkId));
    const userBookmarks = await handleQuery(
      isUserBookmark(ctx.session?.user?.id as string, bookmarkId)
    );

    // Unsubscribe Dublicate at comics & bookmarks
    const comics_bookmarks = comics.bookmarks.map((bookmark) => bookmark.id);
    const intersection = comics_bookmarks.filter((value) =>
      userBookmarks.bookmarks.includes(value)
    );
    for await (const bookmarkId of intersection) {
      await ctx.prisma.bookmark.update({
        select: { comics: true },
        where: { id: bookmarkId },
        data: {
          comics: {
            set: bookmark.comics.filter(
              (bookmark_comicsId) => bookmark_comicsId.id !== comicsId
            ),
          },
        },
      });

      await ctx.prisma.comics.update({
        select: { bookmarks: true },
        where: { id: comicsId },
        data: {
          bookmarks: {
            set: comics.bookmarks.filter(
              (comics_bookmarks) => comics_bookmarks.id !== bookmarkId
            ),
          },
        },
      });
    }

    const fresh_bookmark = await ctx.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      include: { comics: true },
    });

    const fresh_comics = await ctx.prisma.comics.findUnique({
      where: { id: comicsId },
      include: { bookmarks: true },
    });

    // To notify users at new publication
    await ctx.prisma.comics.update({
      select: { bookmarks: true },
      where: { id: comicsId },
      data: {
        bookmarks: { set: [...fresh_comics.bookmarks, fresh_bookmark?.id] },
      },
    });
    await ctx.prisma.bookmark.update({
      select: { comics: true },
      where: { id: bookmarkId },
      data: { comics: { set: [...bookmark.comics, fresh_comics] } },
    });

    return { status: "success", data: bookmark };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};

// @desc    Delete comics bookmarks
// @route   Delete /api/bookmarks/:bookmarks_id
// @access  private
// const unmarkComics = async (req: Request, res: Response)  => {
//   const { bookmarks_id } = req.params;
//   const { comics_id } = req.query;

//   // Check comics
//   const comics = await Comics.findById(comics_id);
//   if (!comics) {
//     res.status(400);
//     throw new Error("Comics not found");
//   }

//   // Check for user
//   if (!req.user) {
//     res.status(401);
//     throw new Error("User not found");
//   }

//   // Check bookmarks
//   const bookmark = await Bookmarks.findById(bookmarks_id);
//   console.log(bookmark, bookmarks_id);
//   if (!bookmark) {
//     res.status(400);
//     throw new Error("Bookmark not found");
//   }

//   // Check for duplicates && if bookmarks owned by user
//   const userBookmarks = req.user.bookmarks;
//   if (!userBookmarks.includes(bookmarks_id)) {
//     res.status(400);
//     throw new Error("Bookmarks isn't users one");
//   } else if (bookmark.comics.includes(comics_id)) {
//     res.status(400);
//     throw new Error("Comics already bookmarked");
//   }

//   const bookmarks = await Bookmarks.findByIdAndUpdate(
//     bookmarks_id,
//     { $addToSet: { comics: comics_id } },
//     { new: true }
//   );
// });
