import React from "react";
import type { ReactNode } from "react";
import Section from "./Section";
import clsx from "clsx";

interface IWrapperProps {
  children: ReactNode;
  className?: string;
}
const Wrapper = ({ children, className = "" }: IWrapperProps) => {
  return (
    <aside
      className={clsx(
        "flex h-[calc(100vh-64px)] w-60 flex-col overflow-y-auto border-r border-gray-dark-secondary",
        className
      )}
    >
      {children}
    </aside>
  );
};

const Sidebar = { Wrapper, Section };
export default Sidebar;
