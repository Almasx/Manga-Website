import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { Lock1, Unlock } from "iconsax-react";
import ManageChaptersLayout, {
  showAddChapterAtom,
  showDeleteChapterAtom,
} from "layout/manage";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useFieldArray, useForm } from "react-hook-form";

import type { ArrayElement } from "utils/util-types";
import Button from "core/ui/primitives/Button";
import CancelCross from "../../../../public/icons/CancelCross.svg";
import DateField from "core/ui/fields/DateField";
import FileField from "core/ui/fields/FileField";
import { IndeterminateCheckbox } from "core/ui/primitives/IndeterminateCheckbox";
import Link from "next/link";
import Modal from "core/ui/primitives/Modal";
import NumberField from "core/ui/fields/NumberField";
import type { PresignedPost } from "aws-sdk/clients/s3";
import { ProBadge } from "core/ui/primitives/Badge";
import { RadioFieldTabs } from "core/ui/primitives/TabBar";
import type { ReactNode } from "react";
import type { SubmitHandler } from "react-hook-form";
import TextField from "core/ui/fields/TextField";
import TimeField from "core/ui/fields/TimeField";
import { appRouter } from "server/trpc/router/_app";
import clsx from "clsx";
import { createContextInner } from "server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getAddChapterSchema } from "lib/schemas/getAddChapterSchema";
import { getDefaultVolumeAndChapterIndex } from "utils/get-default-index";
import { isPublic } from "utils/is-premium";
import { prepareFormData } from "lib/aws/prepare-form-data";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ comicsId: string }>
) => {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: createContextInner({ session: null }),
    transformer: superjson,
  });

  const comicsId = context.params?.comicsId as string;

  try {
    const comics = await ssgHelper.comics.getComics.fetch({ comicsId });
    const { defaultVolumeIndex, defaultChapterIndex, chapterObject } =
      getDefaultVolumeAndChapterIndex(comics.chapters);
    return {
      props: {
        trpcState: ssgHelper.dehydrate(),
        comics,
        defaultVolumeIndex,
        defaultChapterIndex,
        chapterObject,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

const AddChapters = ({
  comics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    data: { chapters },
    refetch,
  } = trpc.comics.getChapters.useQuery(
    { comicsId: comics.id },
    { initialData: comics }
  );

  const [rowSelection, setRowSelection] = useState({});
  const selectedChapterIds = useMemo(
    () =>
      chapters
        .filter((chapters, index) =>
          Object.keys(rowSelection).includes(index.toString())
        )
        .map((chapter) => chapter.id),
    [chapters, rowSelection]
  );

  const columnHelper = createColumnHelper<ArrayElement<typeof chapters>>();
  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <div className="flex h-8 w-12 items-center justify-center border-b border-gray-dark-secondary ">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex h-11 w-12 items-center justify-center border-b border-gray-dark-secondary">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("volumeIndex", {
      header: () => (
        <div className="flex h-8 w-24 items-center border-b border-l border-gray-dark-secondary bg-dark px-5 text-left font-medium text-light/30">
          Том
        </div>
      ),
      cell: (info) => (
        <div className="w-24  border-0 border-b border-l border-gray-dark bg-dark-secondary px-5 py-3 text-sm text-light">
          {info.getValue().toString()}
        </div>
      ),
    }),
    columnHelper.accessor("chapterIndex", {
      header: () => (
        <div className="flex h-8 w-24 items-center border-b border-l  border-gray-dark-secondary px-5 text-left font-medium text-light/30">
          Главы
        </div>
      ),
      cell: (info) => (
        <div className="w-24  border-0 border-b border-l border-gray-dark bg-dark-secondary px-5 py-3 text-sm text-light">
          {info.getValue().toString()}
        </div>
      ),
    }),
    columnHelper.accessor("title", {
      header: () => (
        <div className="flex h-8 w-auto items-center border-b border-l border-gray-dark-secondary bg-dark px-5 text-left font-medium text-light/30">
          Название
        </div>
      ),
      cell: (info) => {
        const premuim = !isPublic(info.row.original.publicAt);
        return (
          <div className="flex h-11 items-center gap-3 border-b border-l border-gray-dark bg-dark-secondary px-5 text-sm text-light">
            <Link
              className="text-lg text-white/20 duration-150 hover:text-white"
              href={`/comics/${comics.id}/chapter/${info.row.original.id}`}
            >
              🡥
            </Link>
            <p className={clsx(premuim && "text-primary")}>{info.getValue()}</p>
            {premuim && <ProBadge className="-ml-1 py-0.5" />}
          </div>
        );
      },
    }),
    columnHelper.accessor("_count.pages", {
      header: () => (
        <div className="flex h-8 w-28 items-center border-b border-l border-gray-dark-secondary bg-dark px-5 text-left font-medium text-light/30">
          Страницы
        </div>
      ),
      cell: (info) => (
        <div className="w-28 border-b border-l border-gray-dark bg-dark-secondary px-5 py-3 text-sm text-light">
          {info.getValue().toString()}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: chapters,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log();
  return (
    <>
      <AddChapterModal chapters={chapters} onSuccess={() => refetch()} />
      <DeleteChapterModal
        chapterIds={selectedChapterIds}
        onSuccess={() => {
          refetch();
          setRowSelection({});
        }}
      />
      <div className="h-fit w-[80vw] overflow-clip rounded-xl border border-gray-dark-secondary ">
        <table className="-mb-1 w-full table-fixed border-collapse overflow-x-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      "p-0",
                      header.id === "title"
                        ? "w-auto"
                        : header.id === "select"
                        ? "w-12"
                        : header.id === "_count_pages"
                        ? "w-28"
                        : "w-24"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={clsx("p-0")}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const DeleteChapterModal = ({
  chapterIds,
  onSuccess,
}: {
  chapterIds: string[];
  onSuccess: () => void;
}) => {
  const [showDeleteChapter, setShowDeleteChapter] = useAtom(
    showDeleteChapterAtom
  );

  const { mutate: deleteChapters, isLoading } =
    trpc.chapter.deleteChapters.useMutation({
      onSuccess: () => {
        onSuccess();
        setShowDeleteChapter(false);
      },
    });

  if (chapterIds.length === 0) {
    return <></>;
  }

  return (
    <Modal visible={showDeleteChapter} setVisible={setShowDeleteChapter}>
      <div className="relative flex w-96 flex-col items-center gap-5 px-8 pt-6 pb-3">
        <h2 className=" w-full text-center text-sm ">
          Вы уверены, что хотите удалить эти главы? Это действие не может быть
          отменено.
        </h2>

        <Button
          type="submit"
          variant="secondary"
          className="w-full rounded-full px-3 py-2 font-bold text-red-600 hover:bg-red-600
                   hover:text-white disabled:bg-red-900"
          onClick={() => deleteChapters({ chapterIds })}
          loading={isLoading}
        >
          Удалить {chapterIds.length} глав
        </Button>
      </div>
    </Modal>
  );
};

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
            message="Выберите страницы главы"
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

AddChapters.getLayout = (
  page: ReactNode,
  { comics }: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <ManageChaptersLayout {...comics} thumbnail={comics.thumbnail?.id as string}>
    {page}
  </ManageChaptersLayout>
);

export default AddChapters;
