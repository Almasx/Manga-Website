import Button from "components/ui/primitives/Button";
import Navigation from "components/ui/templates/Navigation";
import { ArrowLeft2 } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  const { query, back } = useRouter();

  return (
    <Navigation.Wrapper>
      <div className="flex flex-row items-center gap-5">
        <ArrowLeft2 size="18" onClick={() => back()} />
        Загрузка глав {query.title}
      </div>

      <div className="flex flex-row gap-1 rounded-xl bg-surface/5 ">
        <button>Одиночное</button> <button>Множественное</button>
      </div>

      <Button className="w-24 rounded-lg py-1">Загрузить</Button>
    </Navigation.Wrapper>
  );
};

export default Header;
