import AddChapterLayout from "../../../layout/add-chapter";
import FileField from "components/ui/fields/FileField";
import NumberField from "components/ui/fields/NumberField";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { ReactNode } from "react";
import type { SubmitHandler } from "react-hook-form";
import TextField from "components/ui/fields/TextField";
import { getDefaultVolumeAndChapterIndex } from "utils/get-default-index";
import { getKeys } from "utils/get-keys";
import { trpc } from "utils/trpc";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const addChapterSchema = z.object({
  title: z.string().min(1).describe("Name // Введите название манги"),
  chapterIndex: z.number().min(1),
  volumeIndex: z.number().min(1),
  pages: z
    .any()
    .refine((files) => files?.length == 1, "Chapter image is required.")
    .refine(
      (files) => files.every((file: File) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        files.every((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png files are accepted."
    ),
});

type AddChapterSchema = z.infer<typeof addChapterSchema>;

const AddChapter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddChapterSchema>({
    resolver: zodResolver(addChapterSchema),
  });
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const chapterMutation = trpc.comics.postChapter.useMutation();
  const { query } = useRouter();

  const { defaultVolumeIndex, defaultChapterIndex } =
    getDefaultVolumeAndChapterIndex(query.chapters as string);

  const onSubmit: SubmitHandler<AddChapterSchema> = async (data) => {
    // const presignedPages = (await chapterMutation.mutateAsync({
    //   ...data,
    //   comicsId: query.comicsId as string,
    //   pagesLenght: previewPages.length,
    // })) as PresignedPost[];
    // for (const pageIndex in presignedPages) {
    //   const { url, fields } = presignedPages[pageIndex]!;
    //   const formData = new FormData();
    //   Object.keys(fields).forEach((name) => {
    //     formData.append(name, fields[name] as string);
    //   });
    //   formData.append("Content-Type", data.pages[pageIndex].type);
    //   formData.append("file", data.pages[pageIndex]);
    //   for (const pair of formData.keys()) {
    //     console.log(pair);
    //   }
    //   // await fetch(url, {
    //   //   method: "POST",
    //   //   body: formData,
    //   // }).then(async (res) => {
    //   //   if (res.ok) {
    //   //     return router.push("/catalog");
    //   //   }
    //   //   const text = await res.text();
    //   //   throw new Error(text);
    //   // });
    // }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-4/5 flex-col py-7 px-4 pt-8"
    >
      <div className="mb-3 flex flex-row gap-3">
        <NumberField
          className="w-24 px-4"
          label="Том"
          placeholder={`${defaultVolumeIndex} том`}
        />
        <NumberField
          className="w-24 px-4"
          label="Глава"
          placeholder={`${defaultChapterIndex} глава`}
        />
        <TextField
          className="grow"
          placeholder="пр: Вот это поворот"
          label="Название"
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
      <div className="relative mx-auto grid w-full grid-cols-5 gap-5">
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
    </form>
  );
};

AddChapter.getLayout = (page: ReactNode) => (
  <AddChapterLayout>{page}</AddChapterLayout>
);

export default AddChapter;
