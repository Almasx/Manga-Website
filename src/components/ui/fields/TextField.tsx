import clsx from "clsx";
import { forwardRef } from "react";
import type { IField } from "types/IField";

export type ITextFieldProps<T> = {
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label?: string;
  placeholder?: string;
} & IField<T>;

const TextField = forwardRef<
  HTMLInputElement,
  ITextFieldProps<HTMLInputElement>
>(
  (
    {
      className = "",
      startIcon = null,
      endIcon = null,
      value,
      name,
      onChange,
      onBlur,
      label,
      placeholder,
      error,
    },
    ref
  ) => (
    <>
      <div
        className={clsx(
          className,
          "relative",
          (endIcon !== null ||
            startIcon !== null ||
            label !== undefined ||
            error !== undefined) &&
            "flex flex-col "
        )}
      >
        {startIcon !== null && (
          <div className="absolute left-5 top-1/2 mr-3 -translate-y-1/2">
            {startIcon}
          </div>
        )}
        <input
          name={name}
          {...{ value: value }}
          ref={ref}
          onChange={(e) => {
            onChange && onChange(e);
          }}
          onBlur={(e) => {
            onBlur && onBlur(e);
          }}
          placeholder={placeholder}
          className={clsx(
            "ease peer w-full rounded-2xl border border-stroke-200 bg-surface/5 bg-black",
            "px-5 py-3 text-sm text-white duration-300 placeholder:text-white/30",
            "focus:border-primary focus:!bg-black focus:outline-none",
            !error && "focus:ring-2",
            error && "border-red-500 bg-red-500/10",
            startIcon !== null && "pl-12"
          )}
        />
        {endIcon !== null && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {endIcon}
          </div>
        )}
        {label !== undefined && (
          <label
            htmlFor={name}
            className="absolute top-1.5 z-10 origin-[0] -translate-y-4 translate-x-3
                 transform rounded-full bg-black/80 px-1.5 text-xs text-white/30
                 duration-300 
                 peer-placeholder-shown:top-1.5 peer-placeholder-shown:-translate-y-4 
                 peer-placeholder-shown:translate-x-3
                 peer-placeholder-shown:transform peer-placeholder-shown:bg-black/80 peer-placeholder-shown:px-1.5
                 peer-placeholder-shown:text-xs 
                 peer-focus:top-1.5 peer-focus:-translate-y-4 
                 peer-focus:translate-x-3
                 peer-focus:transform peer-focus:bg-black/80 peer-focus:px-1.5
                 peer-focus:text-xs peer-focus:text-primary "
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
  )
);

TextField.displayName = "TextField";

export default TextField;
