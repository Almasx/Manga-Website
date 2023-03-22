import { useEffect, useRef } from "react";

import type { HTMLProps } from "react";
import Tick from "../../../../public/icons/Tick.svg";
import clsx from "clsx";

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <label className="relative flex cursor-pointer items-center ">
      <input
        type="checkbox"
        className={clsx(
          "h-[21px] w-[21px] rotate-45 appearance-none rounded-lg border",
          "border-gray-dark bg-dark-secondary accent-primary duration-200",
          rest.checked && " !border-0 !bg-primary",
          className
        )}
        ref={ref}
        {...rest}
      />
      <div
        className={clsx(
          "invisible absolute top-3 left-1/2 box-content -translate-x-1/2 -translate-y-1/2 transform",
          rest.checked && "!visible"
        )}
      >
        <Tick />
      </div>
    </label>
  );
}
