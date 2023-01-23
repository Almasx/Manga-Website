import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "../../../components/atoms/Button";
import RadioGroupField from "../../../components/atoms/RadioGroupField";
import TextAreaField from "../../../components/atoms/TextAreaField";
import TextField from "../../../components/atoms/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectGenres from "../../../components/organisms/SelectGenres";
import DashBoardLayout from "../../layout/dashboard";

import _ from "lodash";
import { trpc } from "../../../utils/trpc";
import type { PresignedPost } from "aws-sdk/clients/s3";
import NumberField from "../../../components/atoms/NumberField";
import FileField from "../../../components/molecules/FileField";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const addComicsSchema = z.object({
  title: z.string().min(1).describe("Name // Введите название манги"),
  title_ru: z
    .string()
    .min(1)
    .describe("Название // Введите название манги на русском"),
  description: z.string().min(1).describe("Описание // Введите описание манги"),
  year: z
    .number()
    .default(new Date().getFullYear())
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
  genres: z.array(z.number()),
  genresQuery: z.string(),
});

type AddComicsSchema = z.infer<typeof addComicsSchema>;

const AddComics = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddComicsSchema>({
    resolver: zodResolver(addComicsSchema),
    defaultValues: { genres: [], genresQuery: "", status: "ongoing" },
  });

  const comicsMutation = trpc.comics.postComics.useMutation();

  const onSubmit: SubmitHandler<AddComicsSchema> = async (data) => {
    const { url, fields } = (await comicsMutation.mutateAsync(
      data
    )) as PresignedPost;

    const formData = new FormData();
    formData.append("Content-Type", data.thumbnail.type);
    formData.append("file", data.thumbnail);

    Object.keys(fields).forEach((name) =>
      formData.append(name, fields[name] as string)
    );

    await fetch(url, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="col-span-full grid grid-cols-4 gap-5 md:grid-cols-6 lg:grid-cols-10"
      >
        <h3 className="col-span-full h-7 text-xl font-medium text-white/40">
          Сведения о манге
        </h3>

        <FileField
          watchThumbnail={watch("thumbnail")}
          error={errors.thumbnail?.message as string}
          {...register("thumbnail", { required: true })}
        />

        <div className="col-span-5 col-start-3 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <TextField
              label="Название (на английском)"
              placeholder="Введите название манги"
              error={errors.title?.message}
              {...register("title", { required: true })}
            />
            <TextField
              label="Название (на русском)"
              placeholder="Введите название манги на рускком"
              error={errors.title_ru?.message}
              {...register("title_ru", { required: true })}
            />
          </div>
          <TextAreaField
            className="grow"
            label="Описание"
            placeholder="Введите описание манги"
            rows={4}
            {...register("description", { required: true })}
            error={errors.description?.message}
          />
          <NumberField
            label="Год"
            placeholder="Введите год выпуска манги"
            error={errors.year?.message}
            {...register("year", {
              required: true,
              valueAsNumber: true,
              value: new Date().getFullYear(),
            })}
          />
          <div className="grid grid-cols-3 gap-5">
            <RadioGroupField
              label="Выпускается"
              active={!watch("status") || watch("status") === "ongoing"}
              value="ongoing"
              {...register("status")}
            />
            <RadioGroupField
              label="Заброшен"
              active={watch("status") === "abandoned"}
              value="abandoned"
              {...register("status")}
            />
            <RadioGroupField
              label="Завершен"
              active={watch("status") === "finished"}
              value="finished"
              {...register("status")}
            />
          </div>
        </div>

        <SelectGenres
          className="col-span-3 col-start-8"
          selected={watch("genres")}
          query={watch("genresQuery")}
          onQuery={(query) => setValue("genresQuery", query)}
          onToggleGenre={(targetId) => {
            if (!watch("genres").includes(targetId)) {
              setValue("genres", [...watch("genres"), targetId]);
            } else {
              setValue(
                "genres",
                watch("genres").filter((id) => id !== targetId)
              );
            }
          }}
        />

        <Button className="col-span-2 mt-4" type="submit">
          Добавить мангу
        </Button>
      </form>
    </>
  );
};

AddComics.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default AddComics;
