import GridLayout from "components/ui/templates/GridLayout";
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
        <GridLayout>{children}</GridLayout>
      </main>
    </div>
  );
};

export default DashBoardLayout;
