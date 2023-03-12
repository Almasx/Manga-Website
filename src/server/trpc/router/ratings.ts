import { protectedProcedure, router } from "../trpc";

import { z } from "zod";

export const ratingRouter = router({
  getRating: protectedProcedure
    .input(z.object({ comicsId: z.string() }))
    .query(({ ctx, input: { comicsId } }) => {
      const rating = ctx.prisma.ratings.findFirst({
        where: { userId: ctx.session.user.id, comicsId },
      });
      return rating;
    }),

  postRating: protectedProcedure
    .input(z.object({ rating: z.number(), comicsId: z.string() }))
    .mutation(async ({ ctx, input: { rating, comicsId } }) => {
      const comicsRating = await ctx.prisma.ratings.findFirst({
        where: { userId: ctx.session.user.id, comicsId },
      });

      if (comicsRating) {
        await ctx.prisma.ratings.update({
          data: { rating },
          where: { id: comicsRating.id },
        });
      } else {
        await ctx.prisma.ratings.create({
          data: {
            rating,
            comics: { connect: { id: comicsId } },
            user: { connect: { id: ctx.session.user.id } },
          },
        });
      }
    }),
});
