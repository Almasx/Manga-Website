import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";
import Cross from "../icons/Cross";

interface BadgeProps {
  children: ReactNode;
  onClick?: (event?: any) => void;
  className?: string;
}

const Badge = ({ children, onClick, className = "" }: BadgeProps) => {
  const [active, setActive] = useState<boolean>(false);
  return (
    <button
      className={clsx(
        className,
        "rounded-full border py-[6px] px-3 outline-none duration-300 ease-in-out",
        active
          ? "flex flex-row items-center border-transparent bg-primary/20 text-primary"
          : " border-stroke-200 text-white"
      )}
      onClick={(event) => {
        active && onClick && onClick(event);
        setActive(!active);
      }}
    >
      {active && (
        <div className="mr-2">
          <Cross />
        </div>
      )}
      {children}
    </button>
  );
};

export default Badge;
