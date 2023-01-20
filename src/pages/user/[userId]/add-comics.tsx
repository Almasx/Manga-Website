import { ImportCurve } from "iconsax-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "../../../components/atoms/Button";
import Divider from "../../../components/atoms/Divider";
import RadioGroupField from "../../../components/atoms/RadioGroupField";
import TextAreaField from "../../../components/atoms/TextAreaField";
import TextField from "../../../components/atoms/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectGenres from "../../../components/organisms/SelectGenres";
import DashBoardLayout from "../../layout/dashboard";

import _ from "lodash";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const addComicsSchema = z.object({
  title: z.string().describe("Name // Введите название манги"),
  title_ru: z
    .string()
    .describe("Название // Введите название манги на русском"),
  description: z.string().describe("Описание // Введите описание манги"),
  year: z.number().describe("Год // Введите год выпуска манги"),
  thumbnail: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  status: z.enum(["ongoing", "finished", "abandoned"]),
  genres: z.array(z.number()),
  genresQuery: z.string().default(""),
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
    defaultValues: { genres: [], genresQuery: "" },
  });
  const [preview, setPreview] = useState<any>(null);
  const watchThumbnail = watch("thumbnail");

  useEffect(() => {
    if (watchThumbnail && watchThumbnail[0]) {
      const objectUrl = window.URL.createObjectURL(watchThumbnail[0]);
      setPreview(objectUrl);

      return () => window.URL.revokeObjectURL(objectUrl);
    }
  }, [watchThumbnail]);

  const onSubmit: SubmitHandler<AddComicsSchema> = (data) => {
    console.log(data);
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

        <label
          htmlFor="dropzone-file"
          className="relative col-span-2 flex flex-col items-center 
                    overflow-clip rounded-2xl border border-dashed border-primary
                    bg-primary/10 px-3 py-6"
        >
          <div className="text-bold absolute top-2 right-2 z-20 rounded-full bg-black bg-surface/5 py-1 px-2 text-xs">
            227 x 338
          </div>
          <ImportCurve size="64" className="mt-20 mb-6 text-white/30" />
          <div className="flex flex-col items-center gap-3">
            <h6 className="font-meduim font-base">Залейте обложку манги</h6>
            <p className="-mt-2 text-center text-xs text-white/30">
              Поддерживает форматы <br />
              .jpeg, .png, .jpg
            </p>
            <Divider>или</Divider>
            <Button>Выбрать обложку</Button>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            {...register("thumbnail", { required: true })}
          />
          {preview !== null && (
            <img
              src={preview}
              alt="thumbnail image"
              className="absolute inset-0 z-10 min-h-full object-fill"
            />
          )}
        </label>

        <div className="col-span-5 col-start-3 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <TextField
              label="Название (на английском)"
              placeholder="Введите название манги"
              {...register("title", { required: true })}
            />
            <TextField
              label="Название (на русском)"
              placeholder="Введите название манги на рускком"
              {...register("title_ru", { required: true })}
            />
          </div>
          <TextAreaField
            className="grow"
            label="Описание"
            placeholder="Введите описание манги"
            rows={4}
            {...register("description", { required: true })}
          />
          <TextField
            label="Год"
            placeholder="Введите год выпуска манги"
            {...register("year", { required: true })}
          />
          <div className="grid grid-cols-3 gap-5">
            <RadioGroupField
              label="Выпускается"
              active={watch("status") === "ongoing"}
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
      </form>
      <Button className="col-span-2 mt-4" type="submit">
        Добавить мангу
      </Button>
    </>
  );
};

AddComics.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default AddComics;
