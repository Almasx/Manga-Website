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
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
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
      cell: (info) => (
        <NumberField
          value={info.getValue().toString()}
          className="rounded-none border-0"
        />
      ),
    }),
    columnHelper.accessor("volumeIndex", {
      cell: (info) => (
        <NumberField
          value={info.getValue().toString()}
          className="rounded-none border-0"
        />
      ),
    }),
    columnHelper.accessor("title", {
      cell: (info) => (
        <TextField value={info.getValue()} className="rounded-none border-0" />
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
      <table
        className="divide mx-4 mt-8 h-fit w-full border-separate
                   divide-gray-dark-secondary overflow-x-auto  rounded-xl bg-gray-dark "
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
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
                <td key={cell.id} className=" p-0">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
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
    <label className="relative cursor-pointer">
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

export default AddChapters;
