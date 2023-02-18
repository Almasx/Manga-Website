import { checkBookmark, defaultCheckBookmark } from "lib/queries/checkBookmark";
import { protectedProcedure, router } from "../trpc";

import { checkComics } from "lib/queries/checkComics";
import { clearSubscriptions } from "lib/queries/clearSubscriptions";
import { handleQuery } from "server/common/handle-query";
import { isUserBookmark } from "lib/queries/isUserBookmark";
import { subscribeComicsAndBookmarks } from "lib/queries/subscribeBookmark";
import { z } from "zod";

const bookmarkRouter = router({
  addBookmark: protectedProcedure
    .input(
      z.object({
        bookmarkId: z.string({ required_error: "Bookmark id is required" }),
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { bookmarkId, comicsId } = input;

      const comics = await handleQuery(
        checkComics({ bookmarks: true }, { id: comicsId })
      );
      await handleQuery(checkBookmark(bookmarkId));
      const userBookmarks = await handleQuery(
        isUserBookmark(ctx.session?.user?.id as string, bookmarkId)
      );

      // Unsubscribe Dublicate at comics & bookmarks
      await clearSubscriptions(comics, userBookmarks);
      await subscribeComicsAndBookmarks(comicsId, bookmarkId);
    }),

  getBookmark: protectedProcedure
    .input(
      z.object({
        bookmarkId: z.string({ required_error: "Bookmark id is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const { bookmarkId } = input;

      // Bookmarks owned by user
      await handleQuery(
        isUserBookmark(ctx.session?.user?.id as string, bookmarkId)
      );

      const bookmark = await handleQuery(
        checkBookmark(bookmarkId, defaultCheckBookmark)
      );

      return bookmark;
    }),
});

export default bookmarkRouter;

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
