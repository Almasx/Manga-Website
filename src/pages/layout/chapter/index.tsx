import { atom, useAtomValue } from "jotai";

import CommentsSection from "./comments";
import ContentSection from "./content";
import Header from "./header";
import type { ReactNode } from "react";

export const showCommentsAtom = atom<boolean>(false);
export const showContentAtom = atom<boolean>(false);

const ChapterLayout = ({ children }: { children: ReactNode }) => {
  const showComments = useAtomValue(showCommentsAtom);
  const showContent = useAtomValue(showContentAtom);

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <Header />
      <div className="mt-16 flex w-screen flex-row">
        {showContent && <ContentSection />}
        {showComments && <CommentsSection />}
        <div className="relative grow">{children}</div>
      </div>
    </div>
  );
};

export default ChapterLayout;
