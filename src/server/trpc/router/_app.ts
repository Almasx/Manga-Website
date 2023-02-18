import { authRouter } from "./auth";
import bookmarkRouter from "./bookmark";
import { chapterRouter } from "./chapter";
import comicsRouter from "./comics";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  comics: comicsRouter,
  bookmark: bookmarkRouter,
  chapter: chapterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
