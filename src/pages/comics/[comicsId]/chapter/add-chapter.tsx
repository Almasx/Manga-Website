import { zodResolver } from "@hookform/resolvers/zod";
import { PresignedPost } from "aws-sdk/clients/s3";
import FileField from "components/ui/fields/FileField";
import NumberField from "components/ui/fields/NumberField";
import TextField from "components/ui/fields/TextField";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";
import { z } from "zod";
import AddChapterLayout from "../../../layout/add-chapter";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const addChapterSchema = z.object({
  title: z.string().min(1).describe("Name // Введите название манги"),
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

  const onSubmit: SubmitHandler<AddChapterSchema> = async (data) => {
    // const { url, fields } = (await chapterMutation.mutateAsync(
    //   data
    // )) as PresignedPost;
    // const formData = new FormData();
    // Object.keys(fields).forEach((name) => {
    //   formData.append(name, fields[name] as string);
    // });
    // formData.append("Content-Type", data.thumbnail[0].type);
    // formData.append("file", data.thumbnail[0]);
    // for (const pair of formData.keys()) {
    //   console.log(pair);
    // }
    // await fetch(url, {
    //   method: "POST",
    //   body: formData,
    // }).then(async (res) => {
    //   if (res.ok) {
    //     return router.push("/catalog");
    //   }
    //   const text = await res.text();
    //   throw new Error(text);
    // });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-3/4 flex-col py-7 px-4 pt-8"
    >
      <div className="mb-3 flex flex-row gap-3">
        <NumberField
          className="w-24 px-4"
          label="Том"
          placeholder={`${query.new_chapter} том`}
        />
        <NumberField
          className="w-24 px-4"
          label="Глава"
          placeholder={`${query.new_chapter} глава`}
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
      <div className="relative mx-auto grid w-full grid-cols-6 gap-5">
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
