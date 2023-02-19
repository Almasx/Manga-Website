import CancelCross from "../../../../public/icons/CancelCross.svg";
import ChapterCard from "components/molecules/ChapterCard";
import Modal from "core/ui/primitives/Modal";
import React from "react";
import { showContentAtom } from ".";
import { trpc } from "utils/trpc";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import useScreen from "lib/hooks/useScreen";

const ContentSection = () => {
  const { isPhone } = useScreen();
  const { query } = useRouter();

  const [showContent, setShowSection] = useAtom(showContentAtom);
  const { data: comics } = trpc.comics.getChapters.useQuery({
    comicsId: query.comicsId as string,
  });

  return (
    <Modal
      visible={showContent}
      setVisible={setShowSection}
      className="absolute right-0 h-screen w-1/3 !rounded-none !border-stroke-100 bg-black/90 px-5 pt-8 backdrop-blur-md"
      classNameInner="!bg-transparent !rounded-none flex flex-col gap-5"
      backgroundBlur={false}
      backgroundBlack={true}
    >
      <div className="flex flex-row">
        <h3 className="text-2xl font-bold text-white">Главы</h3>
        {isPhone && (
          <button
            className="text-white/66 ml-auto"
            onClick={() => setShowSection(false)}
          >
            <CancelCross />
          </button>
        )}
      </div>
      <div className="scrollbar-hide flex grow flex-col gap-3 overflow-y-auto">
        {comics?.chapters.map(({ chapterIndex, volumeIndex }) => (
          <ChapterCard
            packed={true}
            key={`${volumeIndex}_${chapterIndex}`}
            {...{ chapterIndex, volumeIndex }}
            createdAt={new Date()}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ContentSection;
