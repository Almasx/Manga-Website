import type { ReactNode } from "react";
import Navigation from "../header";
import SideBar from "./sidebar";

const DashBoardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Navigation />
      <main
        className="relative mx-auto grid w-full grid-cols-4 gap-5 px-4 text-white 
                   md:grid-cols-8 lg:grid-cols-12 lg:px-0"
      >
        <SideBar />
        <div className="col-span-full col-start-3 grid grid-cols-4 gap-5 py-8 md:grid-cols-6 lg:grid-cols-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
