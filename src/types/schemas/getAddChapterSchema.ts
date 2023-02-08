import type { preprocessQueryObject } from "utils/get-default-index";
import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const getAddChapterSchema = (
  chapterObject: ReturnType<typeof preprocessQueryObject>
) =>
  z
    .object({
      title: z.string().min(1).describe("Name // Введите название манги"),
      chapterIndex: z.number().min(1),
      volumeIndex: z.number().min(1),
      pages: z
        .any()
        .refine((files) => files?.length > 0, "Chapter image is required."),
      // .refine(
      //   (files) => files.every((file: File) => console.log(file)),
      //   `Max file size is 5MB.`
      // ),
      // .refine(
      //   (files) =>
      //     files &&
      //     files?.length > 0 &&
      //     files.every((file: File) =>
      //       ACCEPTED_IMAGE_TYPES.includes(file.type)
      //     ),
      //   "Only .jpg, .jpeg, .png files are accepted."
      // ),
    })
    .refine(
      ({ chapterIndex, volumeIndex }) =>
        !chapterObject[volumeIndex]?.includes(chapterIndex),
      "Chapter already exists"
    );
