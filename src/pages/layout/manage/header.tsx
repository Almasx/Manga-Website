import { ArrowLeft2 } from "iconsax-react";
import Navigation from "core/ui/templates/Navigation";
import React from "react";
import { useRouter } from "next/router";

const Header = ({ title }: { title: string }) => {
  const { back } = useRouter();

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
    </Navigation.Wrapper>
  );
};

export default Header;
