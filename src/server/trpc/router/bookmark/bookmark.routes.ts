import { router, protectedProcedure } from "../../trpc";
import { postBookmarkSchema } from "./bookmark.schema";
import { bookmarkComics } from "./bookmark.controllers";

const bookmarkRouter = router({
  addBookmark: protectedProcedure
    .input(postBookmarkSchema)
    .mutation(({ input, ctx }) => bookmarkComics({ input, ctx })),
});

export default bookmarkRouter;
