import type { ReactNode } from "react";

const Divider = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-b border-gray-dark-secondary"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-transparent px-4 text-sm  text-light/30">
          {children}
        </span>
      </div>
    </div>
  );
};

export default Divider;
