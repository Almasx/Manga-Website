import bookmarkRouter from "./bookmark";
import { chapterRouter } from "./chapter";
import comicsRouter from "./comics";
import { commentsRouter } from "./comments";
import { ratingRouter } from "./ratings";
import { router } from "../trpc";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  comics: comicsRouter,
  bookmark: bookmarkRouter,
  chapter: chapterRouter,
  comments: commentsRouter,
  rating: ratingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
