import FormSideBar from "./sidebar";
import Header from "./header";
import type { ReactNode } from "react";

const AddChapterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Header />
      <div className="flex flex-row">
        <FormSideBar />
        <div className="flex grow">{children}</div>
      </div>
    </div>
  );
};

export default AddChapterLayout;
