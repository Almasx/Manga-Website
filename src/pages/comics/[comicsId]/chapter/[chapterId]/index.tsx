import ChapterLayout, { showCommentsAtom } from "pages/layout/chapter";

import Button from "core/ui/primitives/Button";
import { Messages1 } from "iconsax-react";
import React from "react";
import type { ReactNode } from "react";
import Spinner from "core/ui/primitives/Spinner";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";

const Chapter = () => {
  const { query } = useRouter();
  const setShowComments = useSetAtom(showCommentsAtom);
  const { data: chapter, isLoading } = trpc.chapter.getChapter.useQuery({
    chapterId: query.chapterId as string,
    comicsId: query.comicsId as string,
  });

  if (isLoading) {
    return <Spinner />;
  }

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
        {chapter?.pages.map((page) => (
          <img
            src={`https://darkfraction.s3.eu-north-1.amazonaws.com/${chapter.comicsId}/volume_${chapter.volumeIndex}_chapter_${chapter.chapterIndex}/${page.id}`}
            alt="image"
            key={page.id}
            className="max-w-3xl"
          />
        ))}
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
        className="!fixed right-[15px] bottom-4 h-12 w-12 rounded-2xl !bg-black text-white md:bottom-5 md:right-5"
      >
        <Messages1 size="24" />
      </Button>
    </>
  );
};

Chapter.getLayout = (page: ReactNode) => <ChapterLayout>{page}</ChapterLayout>;

export default Chapter;
