import Navigation from "../header";
import useScreen from "../../../hooks/useScreen";
import type { ReactNode } from "react";
import { useState } from "react";
import { FilterSearch } from "iconsax-react";
import Button from "../../../components/atoms/Button";
import SideBar from "./sidebar";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const { isDesktop } = useScreen();
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navigation.Wrapper auth={true}>
        <Navigation.Links />
      </Navigation.Wrapper>

      <main
        className="relative mx-auto grid w-full grid-cols-4 gap-5 px-4
                  md:grid-cols-8 lg:grid-cols-12 lg:px-0"
      >
        {children}
        <SideBar show={showSideBar} setShow={setShowSideBar} />

        {isDesktop && (
          <div className="fixed bottom-[15px] right-[15px] z-10">
            <Button
              className="h-9 w-9 rounded-2xl text-white md:hidden"
              content="icon"
              onClick={() => setShowSideBar(true)}
            >
              <FilterSearch size={18} />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
