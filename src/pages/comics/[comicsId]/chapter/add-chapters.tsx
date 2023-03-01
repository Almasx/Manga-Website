import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import AddChapterLayout from "pages/layout/add-chapter";
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
  defaultVolumeIndex,
  defaultChapterIndex,
  chapterObject,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => <></>;

AddChapters.getLayout = (
  page: ReactNode,
  { comics }: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <AddChapterLayout {...comics} thumbnail={comics.thumbnail?.id as string}>
    {page}
  </AddChapterLayout>
);

export default AddChapters;
