import ChapterLayout, { showCommentsAtom } from "pages/layout/chapter";

import Button from "components/ui/primitives/Button";
import { Messages1 } from "iconsax-react";
import React from "react";
import type { ReactNode } from "react";
import { useSetAtom } from "jotai";

const Chapter = () => {
  const setShowComments = useSetAtom(showCommentsAtom);
  return (
    <>
      {/* <div className={clsx(" flex grow flex-col items-center px-[15px] ")}>
        {isSuccess &&
          chapter.images.map((image: string, index: number) => (
            <img src={image} alt="image" key={index} className="max-w-3xl" />
          ))}
      </div> */}
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
