import type { IField } from "types/field";
import clsx from "clsx";
import { forwardRef } from "react";

export type IDateFieldProps<T> = {
  className?: string;
  label?: string;
} & IField<T>;

const TimeField = forwardRef<
  HTMLInputElement,
  IDateFieldProps<HTMLInputElement>
>(({ className = "", value, name, onChange, onBlur, label, error }, ref) => (
  <>
    <div
      className={clsx(
        "relative",
        (label !== undefined || error !== undefined) && "flex flex-col",
        className
      )}
    >
      <input
        name={name}
        type="time"
        {...{ value: value }}
        min={new Date().toISOString().split("T")[0]}
        ref={ref}
        onChange={(e) => {
          console.log(e.target.value);
          onChange && onChange(e);
        }}
        onBlur={(e) => {
          onBlur && onBlur(e);
        }}
        className={clsx(
          "ease peer w-full rounded-2xl border border-gray-dark bg-dark-secondary ",
          "px-4 py-3 text-sm text-light duration-300 placeholder:text-light/30 focus:border-primary focus:outline-none",
          !error && "focus:ring-2",
          error && "border-red-500 bg-red-500/10"
        )}
      />
      {label && (
        <label
          htmlFor={name}
          className="absolute top-1.5 z-10 origin-[0] -translate-y-4 translate-x-3 transform
                 rounded-full bg-dark/80 px-1.5 text-xs text-light/30 duration-300
                 peer-focus:text-primary "
        >
          {label}
        </label>
      )}
      {error && (
        <p className="mt-2 pl-1 text-sm text-red-600 dark:text-red-500">
          {error}
        </p>
      )}
    </div>
  </>
));

TimeField.displayName = "TimeField";

export default TimeField;
