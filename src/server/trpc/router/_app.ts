import { authRouter } from "./auth";
import bookmarkRouter from "./bookmark";
import comicsRouter from "./comics/comics.routes";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  comics: comicsRouter,
  bookmark: bookmarkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
