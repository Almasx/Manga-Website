import type { ReactNode } from "react";
import clsx from "clsx";

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
        "flex flex-row gap-3 py-3 px-5 font-medium hover:bg-dark-secondary hover:text-light",
        active && "bg-dark-secondary text-light",
        classNames
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

export default Tab;
