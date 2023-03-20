import { ArrowLeft2 } from "iconsax-react";
import Button from "core/ui/primitives/Button";
import Navigation from "core/ui/templates/Navigation";
import React from "react";
import { showAddChapterAtom } from ".";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";

const Header = ({ title }: { title: string }) => {
  const { back } = useRouter();
  const setShowAddChapter = useSetAtom(showAddChapterAtom);

  return (
    <Navigation.Wrapper>
      <div className="flex flex-row items-center gap-5">
        <ArrowLeft2 size="18" onClick={() => back()} />
        Загрузка глав {title}
      </div>

      {/* <BoxyTabBar
        tabs={[
          { label: "Одиночное", value: "/add-chapter" },
          { label: "Множественное", value: "/add-chapters" },
        ]}
      /> */}

      <Button
        className="w-24 rounded-lg py-1"
        onClick={() => setShowAddChapter(true)}
      >
        Загрузить
      </Button>
    </Navigation.Wrapper>
  );
};

export default Header;
