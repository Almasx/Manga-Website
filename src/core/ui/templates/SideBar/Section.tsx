import type { ReactNode } from "react";
import clsx from "clsx";

interface IWrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <section className="text-light/66 flex flex-col gap-1 border-t border-gray-dark-secondary pb-3">
      {children}
    </section>
  );
};

interface IHeader {
  text: string;
  className?: string;
}

export const Header = ({ text, className }: IHeader) => {
  return (
    <header className={clsx("py-4 px-5 text-lg font-bold", className)}>
      {text}
    </header>
  );
};

export interface TabProps {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  active: boolean;
  onClick?: (event?: unknown) => void;
}

export const Tab = ({
  children,
  className = "",
  activeClassName = "",
  active,
  onClick,
}: TabProps) => {
  return (
    <li
      className={clsx(
        "flex flex-row gap-3 py-3 px-5 font-medium duration-150 hover:bg-dark-tertiary hover:text-light",
        active && "bg-dark-tertiary text-light",
        active && activeClassName,
        className
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const Section = { Wrapper, Header, Tab };
export default Section;
