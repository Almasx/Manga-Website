import { atom, useAtomValue } from "jotai";

import CommentsSection from "./comments";
import ContentSection from "./content";
import Header from "./header";
import type { IContentIndex } from "./header";
import type { ReactNode } from "react";

export const showCommentsAtom = atom<boolean>(false);
export const showContentAtom = atom<boolean>(false);

interface IChapterLayout {
  children: ReactNode;
  index: IContentIndex;
}

const ChapterLayout = ({
  children,
  index: { chapterIndex, volumeIndex },
}: IChapterLayout) => {
  const showComments = useAtomValue(showCommentsAtom);
  const showContent = useAtomValue(showContentAtom);

  return (
    <div className="min-h-screen overflow-hidden bg-dark text-light">
      <Header index={{ chapterIndex, volumeIndex }} />
      <div className="mt-16 flex w-screen flex-row">
        {showContent && <ContentSection />}
        {showComments && <CommentsSection />}
        <div className="relative grow">{children}</div>
      </div>
    </div>
  );
};

export default ChapterLayout;
