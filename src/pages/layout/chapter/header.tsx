import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

import Navigation from "components/ui/templates/Navigation";
import React from "react";
import { showContentAtom } from ".";
import { useSetAtom } from "jotai";

const Header = () => {
  const setShowIndex = useSetAtom(showContentAtom);

  return (
    <Navigation.Wrapper auth={true} dynamicHide={true} className="fixed z-10">
      <Navigation.Links />
      <div className="flex flex-row items-center gap-5 font-medium text-white">
        <ArrowLeft2 size="18" />
        <button
          onClick={() => {
            setShowIndex(true);
          }}
        >
          <span className="text-white/66 mr-1">Том 1</span> Глава 69
        </button>
        <ArrowRight2 size="18" />
      </div>
    </Navigation.Wrapper>
  );
};

export default Header;
