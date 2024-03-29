import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

import Navigation from "core/ui/templates/Navigation";
import React from "react";
import { api } from "utils/api";
import clsx from "clsx";
import { showContentAtom } from ".";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";

export type IContentIndex = { chapterIndex: number; volumeIndex: number };

const Header = ({
  index: { chapterIndex, volumeIndex },
}: {
  index: IContentIndex;
}) => {
  const setShowIndex = useSetAtom(showContentAtom);
  const { query, push } = useRouter();
  const { data: comics } = api.comics.getChapters.useQuery({
    comicsId: query.comicsId as string,
  });
  const contentIndex = comics?.chapters?.findIndex(
    (chapter) =>
      chapter.chapterIndex === chapterIndex &&
      chapter.volumeIndex === volumeIndex
  );
  const previosChapter = contentIndex && comics?.chapters[contentIndex - 1];
  const followingChapter = contentIndex && comics?.chapters[contentIndex + 1];

  return (
    <Navigation.Wrapper
      dynamicHide={true}
      className="fixed z-10 !grid grid-cols-3"
    >
      <Navigation.Links />
      <div className="flex flex-row place-content-center items-center gap-5 font-medium text-light">
        <button
          onClick={() =>
            previosChapter &&
            push(`/comics/${query.comicsId}/chapter/${previosChapter.id}`)
          }
        >
          <ArrowLeft2
            size="18"
            className={clsx(!previosChapter && "text-light/30")}
          />
        </button>

        <button
          onClick={() => {
            setShowIndex(true);
          }}
        >
          {`Том ${volumeIndex} Глава ${chapterIndex}`}
        </button>

        <button
          onClick={() =>
            followingChapter &&
            push(`/comics/${query.comicsId}/chapter/${followingChapter.id}`)
          }
        >
          <ArrowRight2
            size="18"
            className={clsx(!followingChapter && "text-light/30")}
          />
        </button>
      </div>
      <div className="flex justify-end">
        <Navigation.Auth />
      </div>
    </Navigation.Wrapper>
  );
};

export default Header;
