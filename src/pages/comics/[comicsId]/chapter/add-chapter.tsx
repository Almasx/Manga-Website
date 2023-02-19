import AddChapterLayout from "../../../layout/add-chapter";
import { DevTool } from "@hookform/devtools";
import FileField from "core/ui/fields/FileField";
import NumberField from "core/ui/fields/NumberField";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { ReactNode } from "react";
import type { SubmitHandler } from "react-hook-form";
import TextField from "core/ui/fields/TextField";
import { getAddChapterSchema } from "lib/schemas/getAddChapterSchema";
import { getDefaultVolumeAndChapterIndex } from "utils/get-default-index";
import { trpc } from "utils/trpc";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const AddChapter = () => {
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const chapterMutation = trpc.chapter.postChapter.useMutation();
  const { query } = useRouter();

  const { defaultVolumeIndex, defaultChapterIndex, chapterObject } =
    getDefaultVolumeAndChapterIndex((query.chapters ?? "[]") as string);
  const addChapterSchema = getAddChapterSchema(chapterObject);
  type AddChapterSchema = z.infer<typeof addChapterSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AddChapterSchema>({
    resolver: zodResolver(addChapterSchema),
    defaultValues: {
      chapterIndex: defaultChapterIndex,
      volumeIndex: defaultVolumeIndex,
    },
  });

  const { mutate: s3Mutate, isLoading: isUploading } = useMutation({
    mutationFn: ({ url, formData }: { url: string; formData: FormData }) => {
      return fetch(url, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      console.log("lol");
    },
  });

  const onSubmit: SubmitHandler<AddChapterSchema> = async (data) => {
    console.log(data.pages);
    const presignedPages = (await chapterMutation.mutateAsync({
      ...data,
      comicsId: query.comicsId as string,
      pagesLenght: previewPages.length,
    })) as PresignedPost[];
    console.log(presignedPages);
    for (const pageIndex in presignedPages) {
      const { url, fields } = presignedPages[pageIndex]!;
      const formData = new FormData();

      Object.keys(fields).forEach((name) => {
        formData.append(name, fields[name] as string);
      });
      formData.append("Content-Type", data.pages[pageIndex].type);
      formData.append("file", data.pages[pageIndex]);
      for (const pair of formData.keys()) {
        console.log(pair);
      }

      s3Mutate({ url, formData });
    }
  };

  return (
    <form
      id="chapter-form"
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-[80vw] flex-col py-7 px-4 pt-8"
    >
      <div className="mb-3 flex flex-row gap-3">
        <NumberField
          className="w-24 px-4"
          label="Том"
          error={errors.volumeIndex?.message as string}
          {...register("volumeIndex", { required: true })}
        />
        <NumberField
          className="w-24 px-4"
          label="Глава"
          error={errors.chapterIndex?.message as string}
          {...register("chapterIndex", { required: true })}
        />
        <TextField
          className="grow"
          placeholder="пр: Вот это поворот"
          label="Название"
          error={errors.title?.message as string}
          {...register("title", { required: true })}
        />
      </div>
      <h3 className="mb-2 px-3 text-sm text-white/30">Страницы</h3>
      <FileField
        className="mb-6 h-48 justify-center"
        onPreview={(e) => {
          if (e.target.files) {
            const imageArray = Array.from(e.target.files).map((file) =>
              URL.createObjectURL(file)
            );
            setPreviewPages((prevImages) => prevImages.concat(imageArray));
          }
        }}
        error={errors.pages?.message as string}
        {...register("pages", { required: true })}
      />
      <div className="relative grid w-full grid-cols-5 gap-5">
        {previewPages.map((image) => (
          <img
            className="h-80 w-full cursor-pointer 
          rounded-2xl border border-stroke-100"
            src={image}
            alt=""
            key={image}
          />
        ))}
      </div>
      <DevTool control={control} />
    </form>
  );
};

AddChapter.getLayout = (page: ReactNode) => (
  <AddChapterLayout>{page}</AddChapterLayout>
);

export default AddChapter;
