import Navigation from "core/ui/templates/Navigation";
import type { ReactNode } from "react";
import SideBar from "./sidebar";

const DashBoardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light">
      <Navigation.Wrapper auth={true} className="fixed z-10">
        <Navigation.Links />
      </Navigation.Wrapper>

      <main className="relative mt-16">
        <SideBar />
        <div className="ml-64 flex flex-auto flex-col py-3 px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
