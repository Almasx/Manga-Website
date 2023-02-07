import Navigation from "components/ui/templates/Navigation";
import type { ReactNode } from "react";
import SideBar from "./sidebar";

const DashBoardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navigation.Wrapper auth={true}>
        <Navigation.Links />
      </Navigation.Wrapper>

      <main className="relative mx-auto flex w-full flex-row ">
        <SideBar />
        <div className="flex grow flex-col py-3 px-4">{children}</div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
