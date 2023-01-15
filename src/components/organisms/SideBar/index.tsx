import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";
import Section from "./Section";

interface IWrapperProps {
  children: ReactNode;
  className?: string;
}
const Wrapper = ({ children, className = "" }: IWrapperProps) => {
  return (
    <aside
      className={clsx(" flex flex-col border-r border-stroke-100 ", className)}
    >
      {children}
    </aside>
  );
};

const Sidebar = { Wrapper, Section };
export default Sidebar;
