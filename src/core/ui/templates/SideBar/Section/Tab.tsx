import clsx from "clsx";
import type { ReactNode } from "react";

export interface TabProps {
  children: ReactNode;
  classNames?: string;
  active: boolean;
  onClick?: (event?: unknown) => void;
}

const Tab = ({ children, classNames = "", active, onClick }: TabProps) => {
  return (
    <li
      className={clsx(
        "hover:bg-surface/5 flex flex-row gap-3 py-3 px-5 font-medium hover:text-white",
        active && "bg-surface/5 text-white",
        classNames
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

export default Tab;
