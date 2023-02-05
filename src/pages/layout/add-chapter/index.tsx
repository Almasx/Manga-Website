import GridLayout from "components/ui/templates/GridLayout";
import type { ReactNode } from "react";
import Header from "./header";
import FormSideBar from "./sidebar";

const AddChapterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Header />
      <div className="flex flex-row">
        <FormSideBar />
        <div className="flex w-full flex-col py-4 px-4">{children}</div>
      </div>
    </div>
  );
};

export default AddChapterLayout;
