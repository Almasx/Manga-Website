import type { Comics } from "@prisma/client";
import { Status } from "@prisma/client";
import type { TypeOf } from "zod";
import z from "zod";
import { propertyOf } from "../../../../utils/propertyOf";
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg"];

export const getCatalogSchema = z.object({
  limit: z.number().min(2).max(30).nullish(),
  cursor: z.number().nullish(),
  query: z.string().default(""),
  status: z.nativeEnum(Status).default("ongoing"),
  sort: z
    .enum([
      propertyOf<Comics>("saved"),
      propertyOf<Comics>("year"),
      propertyOf<Comics>("rating"),
    ])
    .default("year"),
  genres: z.array(z.number()).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const getComicsSchema = z.object({
  comicsId: z.number({ required_error: "Comics id is required" }),
});

export const getChapterSchema = z.object({
  chapterId: z.number({ required_error: "Chapter id is required" }),
  comicsId: z.number({ required_error: "Comics id is required" }),
});
// title, title_ru, status, year, genres, description
export const postComicsSchema = z.object({
  title: z.string({ required_error: "title is required" }),
  title_ru: z.string({ required_error: "title_ru is required" }),
  description: z.string({ required_error: "description is required" }),
  status: z.enum(["ongoing", "abandoned", "finished"]).default("ongoing"),
  genres: z.array(z.string().optional()),
  year: z.number({ required_error: "year is required" }),
  // thumbnail: any()
  //   .refine(
  //     (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //     `Max image size is 5MB.`
  //   )
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     "Only .jpg, .jpeg, .png and .webp formats are supported."
  //   ),
});

export const postChapterSchema = z.object({
  comicsId: z.number({ required_error: "Comics id is required" }),
  volume: z.number({ required_error: "Volume is required" }),
  pages: z.array(
    z
      .any()
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
  ),
});

export type GetCatalogSchema = TypeOf<typeof getCatalogSchema>;
export type GetComicsSchema = TypeOf<typeof getComicsSchema>;
export type GetChapterSchema = TypeOf<typeof getChapterSchema>;
export type PostComicsSchema = TypeOf<typeof postComicsSchema>;
export type PostChapterSchema = TypeOf<typeof postChapterSchema>;