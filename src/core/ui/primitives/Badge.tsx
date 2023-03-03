import Cross from "../../../../public/icons/Cross.svg";
import type { ReactNode } from "react";
import clsx from "clsx";

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  onClick?: (event?: unknown) => void;
  className?: string;
}

const Badge = ({ children, active, onClick, className = "" }: BadgeProps) => {
  return (
    <button
      className={clsx(
        className,
        "rounded-full border py-[6px] px-3 outline-none duration-300 ease-in-out",
        active
          ? "flex flex-row items-center border-transparent bg-primary/20 text-primary "
          : " border-gray-dark text-light"
      )}
      onClick={(event) => {
        onClick && onClick(event);
      }}
    >
      {active && (
        <div className="mr-2">
          <Cross className="h-4 w-4 fill-white" />
        </div>
      )}

      {children}
    </button>
  );
};

export default Badge;
