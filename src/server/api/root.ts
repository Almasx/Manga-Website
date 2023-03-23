import bookmarkRouter from "./routers/bookmark";
import { chapterRouter } from "./routers/chapter";
import comicsRouter from "./routers/comics";
import { createTRPCRouter } from "./trpc";
import { ratingRouter } from "./routers/ratings";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  comics: comicsRouter,
  bookmark: bookmarkRouter,
  chapter: chapterRouter,
  rating: ratingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
