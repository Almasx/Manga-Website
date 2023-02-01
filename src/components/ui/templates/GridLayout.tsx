import clsx from "clsx";
import type { ReactNode } from "react";

interface IGridLayoutProps {
  children: ReactNode;
  className?: string;
}

const GridLayout = ({ children, className = "" }: IGridLayoutProps) => {
  return (
    <main
      className={clsx(
        "relative mx-auto grid h-[calc(100vh-64px)] w-full grid-cols-4",
        "gap-5 px-4 md:grid-cols-8 lg:grid-cols-12",
        className
      )}
    >
      {children}
    </main>
  );
};

export default GridLayout;
