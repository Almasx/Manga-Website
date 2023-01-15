import type { TypeOf } from "zod";
import { number, object } from "zod";

export const getBookmarksSchema = object({
  bookmarksId: number({ required_error: "Bookmark id is required" }),
});

export const postBookmarkSchema = object({
  bookmarksId: number({ required_error: "Bookmark id is required" }),
  comicsId: number({ required_error: "Comics id is required" }),
});

export type GetBookmarkSchema = TypeOf<typeof getBookmarksSchema>;
export type PostBookmarkSchema = TypeOf<typeof postBookmarkSchema>;
