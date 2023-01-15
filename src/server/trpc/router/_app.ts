import { router } from "../trpc";
import { authRouter } from "./auth";
import comicsRouter from "./comics/comics.routes";
import bookmarkRouter from "./bookmark/bookmark.routes";

export const appRouter = router({
  auth: authRouter,
  comics: comicsRouter,
  bookmark: bookmarkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
