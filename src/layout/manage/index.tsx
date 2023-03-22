import Header from "./header";
import type { ReactNode } from "react";
import SideBar from "./sidebar";
import { atom } from "jotai";

export const showAddChapterAtom = atom<boolean>(false);
export const showDeleteChapterAtom = atom<boolean>(false);

interface IManageChaptersLayoutProps {
  children: ReactNode;
  thumbnail: string;
  title: string;
  title_ru: string;
}

const ManageChaptersLayout = ({
  children,
  thumbnail,
  title,
  title_ru,
}: IManageChaptersLayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light">
      <Header title={title} />
      <div className="flex flex-row">
        <SideBar thumbnail={thumbnail} title_ru={title_ru} title={title} />
        <div className="flex grow flex-col gap-5 px-4 pt-5">{children}</div>
      </div>
    </div>
  );
};

export default ManageChaptersLayout;
