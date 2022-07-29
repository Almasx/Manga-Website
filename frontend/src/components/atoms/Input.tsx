import clsx from "clsx";

interface A extends React.ComponentPropsWithoutRef<"input"> {
  labelShowed?: false;
  placeholder: string;
}

interface B extends React.ComponentPropsWithoutRef<"input"> {
  labelShowed: true;
  placeholder?: "";
}

interface Icon {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

type Props = { className?: string } & (A | B) & Icon;

const Input = ({
  className = "",
  labelShowed = false,
  placeholder = " ",
  startIcon = null,
  endIcon = null,
}: Props) => {
  return (
    <div
      className={clsx(
        className,
        "relative",
        (endIcon !== null || startIcon !== null || labelShowed) &&
          "flex items-center"
      )}
    >
      {startIcon !== null && (
        <div className="absolute left-5 mr-3 ">{startIcon}</div>
      )}
      <input
        type="text"
        id="floating_outlined"
        placeholder={placeholder}
        className={clsx(
          "ease peer w-full rounded-2xl border border-stroke-200 bg-black bg-surface/5 px-5 py-3 text-sm text-white/33 duration-300 placeholder:text-white/33 focus:border-primary focus:outline-none focus:ring-2",
          startIcon !== null && "pl-12"
        )}
      />
      {endIcon !== null && <div className="absolute right-5 ">{endIcon}</div>}
      {labelShowed && (
        <label
          htmlFor="floating_outlined"
          className="absolute top-1/2 z-10 origin-[0] -translate-y-1/2 translate-x-4
                     transform rounded-full bg-transparent text-sm text-white/33 duration-300 
                     peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:translate-x-3 peer-focus:bg-black/80
                     peer-focus:px-1.5 peer-focus:text-xs peer-focus:text-primary"
        >
          Search
        </label>
      )}
    </div>
  );
};

export default Input;
