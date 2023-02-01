import type { ReactNode } from "react";
import Header from "./header";
import FormSideBar from "./sidebar";

const AddChapterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Header />
      <main
        className="relative mx-auto grid w-full grid-cols-4 gap-5 px-4
              md:grid-cols-8 lg:grid-cols-12 lg:px-0"
      >
        <FormSideBar />
        {children}
      </main>
    </div>
  );
};

export default AddChapterLayout;
