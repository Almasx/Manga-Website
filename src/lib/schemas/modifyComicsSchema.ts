import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const addComicsSchema = z.object({
  title: z.string().min(1).describe("Name // Введите название манги"),
  title_ru: z
    .string()
    .min(1)
    .describe("Название // Введите название манги на русском"),
  description: z.string().min(1).describe("Описание // Введите описание манги"),
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear())
    .describe("Год // Введите год выпуска манги"),
  thumbnail: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png files are accepted."
    ),
  status: z.enum(["ongoing", "finished", "abandoned"]),
  genres: z.array(z.string()),
  genresQuery: z.string(),
});

export const editComicsSchema = z.object({
  title: z.string().min(1).describe("Name // Введите название манги"),
  title_ru: z
    .string()
    .min(1)
    .describe("Название // Введите название манги на русском"),
  description: z.string().min(1).describe("Описание // Введите описание манги"),
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear())
    .describe("Год // Введите год выпуска манги"),
  thumbnail: z
    .any()
    .refine(
      (files) => !files?.[0] || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png files are accepted."
    ),
  status: z.enum(["ongoing", "finished", "abandoned"]),
  genres: z.array(z.string()),
  genresQuery: z.string(),
});

export type AddComicsSchema = z.infer<typeof addComicsSchema>;
export type EditComicsSchema = z.infer<typeof editComicsSchema>;
export type ModifyComicsSchema = z.infer<
  typeof editComicsSchema | typeof addComicsSchema
>;
