import { bookmarkComics, getBookmark } from "./bookmark.controllers";
import { getBookmarkSchema, postBookmarkSchema } from "./bookmark.schema";
import { protectedProcedure, router } from "../../trpc";

const bookmarkRouter = router({
  addBookmark: protectedProcedure
    .input(postBookmarkSchema)
    .mutation(({ input, ctx }) => bookmarkComics({ input, ctx })),
  getBookmark: protectedProcedure
    .input(getBookmarkSchema)
    .query(({ input, ctx }) => getBookmark({ input, ctx })),
});

export default bookmarkRouter;
