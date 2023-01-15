import clsx from "clsx";
import type { ReactNode } from "react";
import Tick from "../../../public/icons/Tick.svg";

interface ICheckBoxFieldProps {
  children: ReactNode;
  active: boolean;
  onClick?: (event?: unknown) => void;
}

const CheckBoxField = ({ children, active, onClick }: ICheckBoxFieldProps) => {
  return (
    <div className="flex gap-x-3 py-3">
      <label className="relative cursor-pointer">
        <input
          type="checkbox"
          className={clsx(
            "h-[21px] w-[21px] rotate-45 appearance-none rounded-lg border",
            "border-stroke-200 bg-surface/5 accent-primary duration-200",
            active && " !border-0 !bg-primary"
          )}
          checked={active}
          onChange={onClick}
        />
        <div
          className={clsx(
            "invisible absolute top-3 left-1/2 box-content -translate-x-1/2 -translate-y-1/2 transform",
            active && "!visible"
          )}
        >
          <Tick />
        </div>
      </label>
      <p
        className={clsx(
          "relative text-base font-medium text-white",
          !active && "text-white/30"
        )}
      >
        {children}
      </p>
    </div>
  );
};

export default CheckBoxField;
