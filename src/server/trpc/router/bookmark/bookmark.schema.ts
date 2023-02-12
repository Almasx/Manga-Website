import type { TypeOf } from "zod";
import { z } from "zod";

export const getBookmarkSchema = z.object({
  bookmarkId: z.string({ required_error: "Bookmark id is required" }),
});

export const postBookmarkSchema = z.object({
  bookmarkId: z.string({ required_error: "Bookmark id is required" }),
  comicsId: z.string({ required_error: "Comics id is required" }),
});

export type GetBookmarkSchema = TypeOf<typeof getBookmarkSchema>;
export type PostBookmarkSchema = TypeOf<typeof postBookmarkSchema>;
