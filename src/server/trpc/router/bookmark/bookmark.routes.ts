import { bookmarkComics, getBookmark } from "./bookmark.controllers";
import { protectedProcedure, router } from "../../trpc";

import { z } from "zod";

const bookmarkRouter = router({
  addBookmark: protectedProcedure
    .input(
      z.object({
        bookmarkId: z.string({ required_error: "Bookmark id is required" }),
        comicsId: z.string({ required_error: "Comics id is required" }),
      })
    )
    .mutation(({ input, ctx }) => bookmarkComics({ input, ctx })),

  getBookmark: protectedProcedure
    .input(
      z.object({
        bookmarkId: z.string({ required_error: "Bookmark id is required" }),
      })
    )
    .query(({ input, ctx }) => getBookmark({ input, ctx })),
});

export default bookmarkRouter;
