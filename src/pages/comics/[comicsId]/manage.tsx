import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import type { HTMLProps, ReactNode } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef } from "react";

import AddChapterModal from "components/templates/AddChapterModal";
import type { ArrayElement } from "utils/util-types";
import Link from "next/link";
import ManageChaptersLayout from "layout/manage";
import NumberField from "core/ui/fields/NumberField";
import TextField from "core/ui/fields/TextField";
import Tick from "../../../../public/icons/Tick.svg";
import { appRouter } from "server/trpc/router/_app";
import clsx from "clsx";
import { createContextInner } from "server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getDefaultVolumeAndChapterIndex } from "utils/get-default-index";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useState } from "react";

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
  const columnHelper = createColumnHelper<ArrayElement<typeof chapters>>();
  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <div className="flex h-8 w-12 justify-center border-b border-gray-dark-secondary ">
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
        <div className="flex h-11 w-12 justify-center border-b border-gray-dark-secondary">
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
    columnHelper.accessor("chapterIndex", {
      header: () => (
        <div className="flex h-8 w-24 items-center border-b border-l  border-gray-dark-secondary px-5 text-left font-medium text-light/30">
          Главы
        </div>
      ),
      cell: (info) => (
        <NumberField
          value={info.getValue().toString()}
          className="!w-24 rounded-none border-0 border-b border-l"
        />
      ),
    }),
    columnHelper.accessor("volumeIndex", {
      header: () => (
        <div className="flex h-8 w-24 items-center border-b border-l border-gray-dark-secondary bg-dark px-5 text-left font-medium text-light/30">
          Том
        </div>
      ),
      cell: (info) => (
        <NumberField
          value={info.getValue().toString()}
          className="!w-24 rounded-none border-0 border-b border-l"
        />
      ),
    }),
    columnHelper.accessor("title", {
      header: () => (
        <div className="flex h-8 w-auto items-center border-b border-l border-gray-dark-secondary bg-dark px-5 text-left font-medium text-light/30">
          Название
        </div>
      ),
      cell: (info) => {
        return (
          <TextField
            startIcon={
              <Link
                className="text-lg text-white/20 duration-150 hover:text-white"
                href={`/comics/${comics.id}/chapter/${info.row.original.id}`}
              >
                🡥
              </Link>
            }
            value={info.getValue()}
            className="rounded-none border-t-0 border-r-0"
          />
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
        <NumberField
          value={info.getValue().toString()}
          className="!w-28 rounded-none border-t-0 border-r-0"
        />
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

  return (
    <>
      <AddChapterModal chapters={chapters} onSuccess={() => refetch()} />
      <div className="mx-4 mt-8 h-fit w-[80vw] overflow-clip rounded-xl border border-gray-dark-secondary ">
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

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <label className="relative flex cursor-pointer items-center ">
      <input
        type="checkbox"
        className={clsx(
          "h-[21px] w-[21px] rotate-45 appearance-none rounded-lg border",
          "border-gray-dark bg-dark-secondary accent-primary duration-200",
          rest.checked && " !border-0 !bg-primary",
          className
        )}
        ref={ref}
        {...rest}
      />
      <div
        className={clsx(
          "invisible absolute top-3 left-1/2 box-content -translate-x-1/2 -translate-y-1/2 transform",
          rest.checked && "!visible"
        )}
      >
        <Tick />
      </div>
    </label>
  );
}

AddChapters.getLayout = (
  page: ReactNode,
  { comics }: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <ManageChaptersLayout {...comics} thumbnail={comics.thumbnail?.id as string}>
    {page}
  </ManageChaptersLayout>
);

export default AddChapters;
