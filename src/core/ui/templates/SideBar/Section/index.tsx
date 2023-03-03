import Header from "./Header";
import type { ReactNode } from "react";
import Tab from "./Tab";

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

const Section = { Wrapper, Header, Tab };
export default Section;
