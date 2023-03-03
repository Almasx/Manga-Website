import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import AddChapterModal from "components/templates/AddChapterModal";
import type { ArrayElement } from "types/array-element";
import ManageChaptersLayout from "pages/layout/manage";
import NumberField from "core/ui/fields/NumberField";
import type { ReactNode } from "react";
import { appRouter } from "server/trpc/router/_app";
import { createContextInner } from "server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getDefaultVolumeAndChapterIndex } from "utils/get-default-index";
import superjson from "superjson";

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
  console.log(comics.chapters);

  const columnHelper =
    createColumnHelper<ArrayElement<typeof comics.chapters>>();
  const columns = [
    // Display Column
    columnHelper.accessor("chapterIndex", {
      cell: (info) => (
        <NumberField
          value={info.getValue().toString()}
          className="rounded-none border-none"
        />
      ),
    }),
    columnHelper.accessor("volumeIndex", {
      cell: (info) => (
        <NumberField
          value={info.getValue().toString()}
          className="rounded-none border-none"
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: comics.chapters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <AddChapterModal chapters={comics.chapters} />
      <table className="divide mx-4 mt-8 h-fit divide-gray-dark-secondary overflow-x-auto rounded-3xl border border-gray-dark-secondary ">
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

export default AddChapters;
