import CancelCross from "../../../public/icons/CancelCross.svg";
import ChapterCard from "components/molecules/ChapterCard";
import Modal from "core/ui/primitives/Modal";
import React from "react";
import { api } from "utils/api";
import { showContentAtom } from ".";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import useScreen from "lib/hooks/useScreen";

const ContentSection = () => {
  const { isSmallDevice } = useScreen();
  const { query } = useRouter();

  const [showContent, setShowSection] = useAtom(showContentAtom);
  const { data: comics } = api.comics.getChapters.useQuery({
    comicsId: query.comicsId as string,
  });

  return (
    <Modal
      visible={showContent}
      setVisible={setShowSection}
      className="absolute right-0 h-screen w-1/3 !rounded-none !border-gray-dark-secondary bg-dark/90 px-5 pt-8 backdrop-blur-md"
      classNameInner="!bg-transparent !rounded-none flex flex-col gap-5"
      backgroundBlur={false}
      backgroundBlack={true}
    >
      <div className="flex flex-row">
        <h3 className="text-2xl font-bold text-light">Главы</h3>
        {isSmallDevice && (
          <button
            className="text-light/66 ml-auto"
            onClick={() => setShowSection(false)}
          >
            <CancelCross />
          </button>
        )}
      </div>
      <div className="scrollbar-hide flex  flex-col gap-3 overflow-y-auto ">
        {comics?.chapters.map((chapter) => (
          <ChapterCard
            read={false}
            packed={true}
            key={`${chapter.volumeIndex}_${chapter.chapterIndex}`}
            {...chapter}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ContentSection;
