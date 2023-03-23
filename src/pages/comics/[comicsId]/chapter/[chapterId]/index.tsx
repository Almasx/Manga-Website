import ChapterLayout, { showCommentsAtom } from "layout/chapter";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import Button from "core/ui/primitives/Button";
import { Messages1 } from "iconsax-react";
import React from "react";
import type { ReactNode } from "react";
import { appRouter } from "server/api/root";
import { createInnerTRPCContext } from "server/api/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthToken } from "server/auth";
import { prisma } from "server/db";
import superjson from "superjson";
import { useSetAtom } from "jotai";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ comicsId: string; chapterId: string }>
) => {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const comicsId = context.params?.comicsId as string;
  const chapterId = context.params?.chapterId as string;

  try {
    const chapter = await ssgHelper.chapter.getChapter.fetch({
      chapterId,
      comicsId,
    });
    const token = await getServerAuthToken(context);
    if (
      chapter.publicAt
        ? token?.role === "ADMIN" ||
          token?.premium ||
          chapter.publicAt.valueOf() - new Date().valueOf() <= 0
        : true
    ) {
      prisma.user.update({
        where: { id: token?.id },
        data: {
          chaptersRead: { connect: { id: chapterId } },
        },
      });
      if (token?.id)
        return {
          props: {
            trpcState: ssgHelper.dehydrate(),
            chapter,
          },
        };
    }

    return {
      redirect: {
        destination: "/pro",
        permanent: false,
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

const Chapter = ({
  chapter,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const setShowComments = useSetAtom(showCommentsAtom);

  return (
    <>
      <div className="flex grow flex-col items-center px-[15px] ">
        {chapter?.pages.map((page) => (
          <img
            src={`https://darkfraction.s3.eu-north-1.amazonaws.com/${chapter.comicsId}/volume_${chapter.volumeIndex}_chapter_${chapter.chapterIndex}/${page.id}`}
            alt="image"
            key={page.id}
            className="max-w-3xl"
          />
        ))}
      </div>
      <Button
        variant="secondary"
        content="icon"
        onClick={() => {
          setShowComments((previos) => !previos);
        }}
        className="!fixed right-[15px] bottom-4 h-12 w-12 rounded-2xl !bg-dark text-light md:bottom-5 md:right-5"
      >
        <Messages1 size="24" />
      </Button>
    </>
  );
};

Chapter.getLayout = (
  page: ReactNode,
  {
    chapter: { chapterIndex, volumeIndex },
  }: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <ChapterLayout index={{ chapterIndex, volumeIndex }}>{page}</ChapterLayout>
);

export default Chapter;
