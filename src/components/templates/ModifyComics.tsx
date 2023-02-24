import Button from "core/ui/primitives/Button";
import FileField from "core/ui/fields/FileField";
import NumberField from "core/ui/fields/NumberField";
import type { PresignedPost } from "aws-sdk/clients/s3";
import RadioGroupField from "core/ui/fields/RadioGroupField";
import SelectGenres from "components/organisms/SelectGenres";
import Spinner from "core/ui/primitives/Spinner";
import type { SubmitHandler } from "react-hook-form";
import TextAreaField from "core/ui/fields/TextAreaField";
import TextField from "core/ui/fields/TextField";
import _ from "lodash";
import { trpc } from "utils/trpc";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const ModifyComicsSchema = z.object({
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

type ModifyComicsSchema = z.infer<typeof ModifyComicsSchema>;

const ModifyComics = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ModifyComicsSchema>({
    resolver: zodResolver(ModifyComicsSchema),
    defaultValues: { genres: [], genresQuery: "", status: "ongoing" },
  });

  useEffect(() => {
    register("genres");
    register("genresQuery");
  }, [register]);

  const genresValue = watch("genres");

  const comicsMutation = trpc.comics.postComics.useMutation();
  const { mutate: s3Mutate, isLoading: isUploading } = useMutation({
    mutationFn: ({ url, formData }: { url: string; formData: FormData }) => {
      return fetch(url, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      router.push("/catalog");
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<ModifyComicsSchema> = async (data) => {
    const { url, fields } = (await comicsMutation.mutateAsync(
      data
    )) as PresignedPost;

    const formData = new FormData();
    Object.keys(fields).forEach((name) => {
      formData.append(name, fields[name] as string);
    });

    formData.append("Content-Type", data.thumbnail[0].type);
    formData.append("file", data.thumbnail[0]);

    s3Mutate({ url, formData });
  };

  if (isUploading) {
    return (
      <div className="my-auto">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <h3 className="mb-5 text-xl font-medium text-white/40 ">
        Сведения о манге
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit, (error) => {
          throw error;
        })}
        className="grid grid-cols-4 gap-5 md:grid-cols-6 lg:grid-cols-10"
      >
        <FileField
          className="h-full"
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
          selected={genresValue}
          query={watch("genresQuery")}
          onQuery={(query) => setValue("genresQuery", query)}
          onToggleGenre={(targetId) => {
            if (!genresValue.includes(targetId)) {
              setValue("genres", [...genresValue, targetId]);
            } else {
              setValue(
                "genres",
                genresValue.filter((id) => id !== targetId)
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

export default ModifyComics;
