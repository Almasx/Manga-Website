import type { ReactNode } from "react";
import clsx from "clsx";

interface IGridLayoutProps {
  children: ReactNode;
  className?: string;
}

const GridLayout = ({ children, className = "" }: IGridLayoutProps) => {
  return (
    <main
      className={clsx(
        "relative mx-auto grid w-full grid-cols-4",
        "gap-5 overflow-x-hidden px-4 py-3 md:grid-cols-8 lg:grid-cols-12",
        className
      )}
    >
      {children}
    </main>
  );
};

export default GridLayout;
