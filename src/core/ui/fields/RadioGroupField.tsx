import type { IField } from "types/field";
import Tick from "../../../../public/icons/Tick.svg";
import clsx from "clsx";
import { forwardRef } from "react";

type IRadioGroupFieldProps = {
  label: string;
  active: boolean;
} & IField<HTMLInputElement>;

// eslint-disable-next-line react/display-name
const RadioGroupField = forwardRef<HTMLInputElement, IRadioGroupFieldProps>(
  ({ name, label, value, active, onChange, onBlur }, ref) => {
    return (
      <div
        className={clsx(
          "relative flex h-[46px] items-center gap-x-3 rounded-2xl border ",
          " border-gray-dark bg-dark-secondary bg-dark px-5",
          active && "border-primary bg-primary/10"
        )}
      >
        <div className="relative cursor-pointer ">
          <input
            ref={ref}
            type="radio"
            className={clsx(
              "h-[21px] w-[21px] rotate-45 appearance-none rounded-lg border",
              "border-gray-dark bg-dark-secondary accent-primary duration-200",
              active && "!border-0 !bg-primary"
            )}
            name={name}
            onChange={(e) => {
              onChange && onChange(e);
            }}
            onBlur={(e) => {
              onBlur && onBlur(e);
            }}
            value={value}
          />
          {active && (
            <div
              className={clsx(
                "absolute top-3 left-1/2 box-content -translate-x-1/2 -translate-y-1/2 transform"
              )}
            >
              <Tick />
            </div>
          )}
        </div>
        <p
          className={clsx(
            "relative text-sm text-light/30",
            active && "!text-light"
          )}
        >
          {label}
        </p>
      </div>
    );
  }
);

export default RadioGroupField;
