import type { ReactNode } from "react";
import Header from "./Header";
import Tab from "./Tab";

interface IWrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <section className="text-white/66 flex flex-col gap-1 border-t border-stroke-100 pb-3">
      {children}
    </section>
  );
};

const Section = { Wrapper, Header, Tab };
export default Section;
