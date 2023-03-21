import { Lock1, Unlock } from "iconsax-react";
import { useFieldArray, useForm } from "react-hook-form";

import Button from "core/ui/primitives/Button";
import CancelCross from "../../../public/icons/CancelCross.svg";
import DateField from "core/ui/fields/DateField";
import FileField from "core/ui/fields/FileField";
import Modal from "core/ui/primitives/Modal";
import NumberField from "core/ui/fields/NumberField";
import type { PresignedPost } from "aws-sdk/clients/s3";
import { RadioFieldTabs } from "core/ui/primitives/TabBar";
import type { SubmitHandler } from "react-hook-form";
import TextField from "core/ui/fields/TextField";
import TimeField from "core/ui/fields/TimeField";
import { getAddChapterSchema } from "lib/schemas/getAddChapterSchema";
import { getDefaultVolumeAndChapterIndex } from "utils/get-default-index";
import { prepareFormData } from "lib/aws/prepare-form-data";
import { showAddChapterAtom } from "layout/manage";
import { trpc } from "utils/trpc";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import type { z } from "zod/lib";
import { zodResolver } from "@hookform/resolvers/zod";

interface IAddChapterModalProps {
  chapters: {
    volumeIndex: number;
    id: string;
    createdAt: Date;
    chapterIndex: number;
  }[];
  onSuccess: () => void;
}

const AddChapterModal = ({ chapters, onSuccess }: IAddChapterModalProps) => {
  const { query } = useRouter();
  const [showAddChapter, setShowAddChapter] = useAtom(showAddChapterAtom);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { defaultVolumeIndex, defaultChapterIndex, chapterObject } =
    getDefaultVolumeAndChapterIndex(chapters);
  const chapterMutation = trpc.chapter.postChapter.useMutation();

  const addChapterSchema = getAddChapterSchema(chapterObject);
  type AddChapterSchema = z.infer<typeof addChapterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm<AddChapterSchema>({
    resolver: zodResolver(addChapterSchema),
    defaultValues: {
      chapterIndex: defaultChapterIndex,
      volumeIndex: defaultVolumeIndex,
    },
  });
  const { append, remove } = useFieldArray({ control, name: "pages" });

  const { mutateAsync: s3Mutate } = useMutation({
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
    setIsUploading(true);

    const presignedPages = await chapterMutation.mutateAsync({
      ...data,
      comicsId: query.comicsId as string,
      pagesLenght: previewPages.length,
      ...(data.access && {
        publicAt: new Date(
          data.date?.getFullYear() as number,
          data.date?.getMonth() as number,
          data.date?.getDate() as number,
          data.time.getHours(),
          data.time.getMinutes(),
          0
        ),
      }),
    });
    for (const pageIndex in presignedPages) {
      const { url, fields } = presignedPages[pageIndex] as PresignedPost;
      const formData = prepareFormData({ page: data.pages[pageIndex], fields });
      await s3Mutate({ url, formData });
    }
    onSuccess();
    setIsUploading(false);
    reset();
    setShowAddChapter(false);
  };

  return (
    <Modal
      visible={showAddChapter}
      setVisible={setShowAddChapter}
      className="scrollbar-hide relative w-[720px]"
    >
      <form
        id="chapter-form"
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-auto flex w-full flex-col py-7 px-4 pt-8"
        encType="multipart/form-data"
      >
        <div
          className="absolute -top-0 left-1/2 z-20 -translate-y-1/2 -translate-x-1/2 
        transform rounded-full border border-gray-dark bg-dark-secondary  px-3 py-2 text-xs font-bold text-light"
        >
          Добавить главу
        </div>
        <div className="mb-4 flex flex-row gap-3">
          <NumberField
            className="!w-24 px-4"
            label="Том"
            error={errors.volumeIndex?.message as string}
            {...register("volumeIndex", {
              required: true,
              valueAsNumber: true,
            })}
          />
          <NumberField
            className="!w-24 px-4"
            label="Глава"
            error={errors.chapterIndex?.message as string}
            {...register("chapterIndex", {
              required: true,
              valueAsNumber: true,
            })}
          />
          <TextField
            className="grow"
            placeholder="пр: Вот это поворот"
            label="Название"
            error={errors.title?.message as string}
            {...register("title", { required: true })}
          />
        </div>
        <div className="mb-3 flex flex-row gap-3">
          <RadioFieldTabs
            tabs={[
              { label: <Unlock size="24" />, value: "public" },
              { label: <Lock1 size="24" />, value: "private" },
            ]}
            label="Доступ"
            onChange={(value) => setValue("access", value)}
          />
          <DateField
            className="grow"
            label="Дата"
            error={errors.date?.message as string}
            disabled={watch("access") !== "private"}
            {...register("date", { valueAsDate: true })}
          />
          <TimeField
            className="grow"
            label="Время"
            error={errors.time?.message as string}
            disabled={watch("access") !== "private"}
            {...register("time")}
          />
        </div>
        <div className="scrollbar-hide relative flex grow flex-col overflow-y-auto">
          <h3 className="mb-2 px-3 text-sm text-light/30">Страницы</h3>
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
            onChange={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              for (const file of e.target.files!) {
                append(file);
              }
            }}
          />

          <div className="relative grid h-44 w-full grid-cols-3 gap-5">
            {previewPages.map((image, index) => (
              <div className="relative flex h-80 w-full" key={image}>
                <img
                  className="grow cursor-pointer rounded-2xl border border-gray-dark-secondary"
                  src={image}
                  alt={`page_${index}`}
                />
                <Button
                  className="!absolute top-1 right-1 z-20  h-9 w-9 
                  rounded-2xl border-2 !bg-dark text-light
                  hover:border-red-600 hover:!bg-red-800/80 hover:backdrop-blur-xl"
                  content="icon"
                  variant="secondary"
                  onClick={() => {
                    remove(index);
                    setPreviewPages(
                      previewPages.filter(
                        (page, pageIndex) => pageIndex !== index
                      )
                    );
                  }}
                >
                  <CancelCross />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Button
          loading={isUploading}
          type="submit"
          className="absolute -bottom-0 left-1/2 z-20 translate-y-3 -translate-x-1/2 transform rounded-full bg-primary px-3 py-2 font-bold text-light"
        >
          Добавить главу
        </Button>
      </form>
    </Modal>
  );
};

export default AddChapterModal;
