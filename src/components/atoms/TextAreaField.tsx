import clsx from "clsx";
import { forwardRef } from "react";
import type { ITextFieldProps } from "./TextField";

type ITextAreaFieldProps = {
  rows?: number;
} & ITextFieldProps<HTMLTextAreaElement>;

// eslint-disable-next-line react/display-name
const TextAreaField = forwardRef<HTMLTextAreaElement, ITextAreaFieldProps>(
  ({ value, name, onChange, onBlur, label, placeholder, rows = 3 }, ref) => (
    <>
      <div
        className={clsx(
          "relative",
          label !== undefined && "flex grow flex-col"
        )}
      >
        <textarea
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
          rows={rows}
          className={clsx(
            "ease peer w-full grow rounded-2xl border border-stroke-200 bg-surface/5 bg-black px-5 py-3 text-sm text-white duration-300 placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2"
          )}
        />
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
      </div>
    </>
  )
);

export default TextAreaField;
