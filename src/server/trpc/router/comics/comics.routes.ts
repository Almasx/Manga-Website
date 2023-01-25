import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../trpc";
import {
  getCatalog,
  getChapter,
  getComics,
  postChapter,
  postComics,
} from "./comics.controllers";
import {
  getCatalogSchema,
  getChapterSchema,
  getComicsSchema,
  postChapterSchema,
  postComicsSchema,
} from "./comics.schema";

const comicsRouter = router({
  getCatalog: publicProcedure
    .input(getCatalogSchema)
    .query(({ input, ctx }) => getCatalog({ input, ctx })),
  getGenres: publicProcedure.query(({ ctx }) => ctx.prisma.genre.findMany()),
  getComics: publicProcedure
    .input(getComicsSchema)
    .query(({ input, ctx }) => getComics({ input, ctx })),
  postComics: protectedProcedure
    .input(postComicsSchema)
    .mutation(({ input, ctx }) => postComics({ input, ctx })),
  getChapter: publicProcedure
    .input(getChapterSchema)
    .query(({ input, ctx }) => getChapter({ input, ctx })),
  postChapter: protectedProcedure
    .input(postChapterSchema)
    .mutation(({ input, ctx }) => postChapter({ input, ctx })),
});

export default comicsRouter;
