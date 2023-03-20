import AddChapterModal from "components/templates/AddChapterModal";
import FormSideBar from "./sidebar";
import Header from "./header";
import type { ReactNode } from "react";
import { atom } from "jotai";

export const showAddChapterAtom = atom<boolean>(false);

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
        <FormSideBar thumbnail={thumbnail} title_ru={title_ru} title={title} />
        <div className="flex grow">{children}</div>
      </div>
    </div>
  );
};

export default ManageChaptersLayout;
