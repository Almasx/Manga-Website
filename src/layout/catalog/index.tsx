import Button from "core/ui/primitives/Button";
import { FilterSearch } from "iconsax-react";
import FilterSideBar from "./sidebar";
import Navigation from "core/ui/templates/Navigation";
import type { ReactNode } from "react";
import useScreen from "lib/hooks/useScreen";
import { useState } from "react";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const { isSmallDevice, isLaptop } = useScreen();
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light">
      <Navigation.Wrapper className="fixed z-20">
        <Navigation.Links />
        <Navigation.Auth />
      </Navigation.Wrapper>

      <main className="relative mx-auto mt-16 w-full flex-row">
        {children}
        <FilterSideBar show={showSideBar} setShow={setShowSideBar} />
      </main>
      {(isSmallDevice || isLaptop) && !showSideBar && (
        <div className="fixed bottom-4 right-4 z-10">
          <Button
            className=" h-9 w-9 rounded-2xl text-light"
            content="icon"
            onClick={() => setShowSideBar(true)}
          >
            <FilterSearch size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
