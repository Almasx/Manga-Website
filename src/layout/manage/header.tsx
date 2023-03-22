import { ArrowLeft2, Trash } from "iconsax-react";
import { showAddChapterAtom, showDeleteChapterAtom } from ".";

import Button from "core/ui/primitives/Button";
import Navigation from "core/ui/templates/Navigation";
import React from "react";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";

const Header = ({ title }: { title: string }) => {
  const { back } = useRouter();
  const setShowAddChapter = useSetAtom(showAddChapterAtom);
  const setShowDeleteChapter = useSetAtom(showDeleteChapterAtom);

  return (
    <Navigation.Wrapper>
      <div className="flex flex-row items-center gap-5">
        <ArrowLeft2 size="18" onClick={() => back()} />
        Загрузка глав {title}
      </div>

      <div className="flex gap-3">
        <Button
          className="aspect-square h-10 rounded-lg border-2 !bg-dark text-light/60 hover:border-red-600
                  hover:!bg-red-800/80 hover:backdrop-blur-xl disabled:text-light/30
                  disabled:hover:border-gray-dark-secondary disabled:hover:!bg-dark"
          content="icon"
          variant="secondary"
          onClick={() => setShowDeleteChapter(true)}
        >
          <Trash />
        </Button>
        <Button
          className="w-24 rounded-lg "
          onClick={() => setShowAddChapter(true)}
        >
          Загрузить
        </Button>
      </div>
    </Navigation.Wrapper>
  );
};

export default Header;
