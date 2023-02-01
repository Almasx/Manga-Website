import { ArrowLeft2 } from "iconsax-react";
import React from "react";
import Button from "../../../components/atoms/Button";
import Navigation from "../header";

const Header = () => {
  return (
    <Navigation.Wrapper>
      <div className="flex flex-row items-center gap-5">
        <ArrowLeft2 size="18" />
        Загрузка глав Eliceed
      </div>

      <div className="flex flex-row gap-1 rounded-xl bg-surface/5 ">
        <button>Одиночное</button> <button>Множественное</button>
      </div>

      <Button className="w-24 rounded-lg py-1">Загрузить</Button>
    </Navigation.Wrapper>
  );
};

export default Header;
