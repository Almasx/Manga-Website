import Button from "core/ui/primitives/Button";
import { FilterSearch } from "iconsax-react";
import FilterSideBar from "./sidebar";
import Navigation from "core/ui/templates/Navigation";
import type { ReactNode } from "react";
import useScreen from "lib/hooks/useScreen";
import { useState } from "react";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const { isSmallDevice } = useScreen();
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light">
      <Navigation.Wrapper auth={true}>
        <Navigation.Links />
      </Navigation.Wrapper>

      <main className="relative mx-auto w-full flex-row">
        {children}
        <FilterSideBar show={showSideBar} setShow={setShowSideBar} />
      </main>
      {isSmallDevice && (
        <div className="fixed bottom-4 right-4">
          <Button
            className="z-10 h-9 w-9 rounded-2xl text-light"
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
