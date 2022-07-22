import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  variant?: "primary" | "secondary" | "text";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        className,
        "box-content rounded-xl px-3 py-2 m-2", // box-model
        "font-bold text-center", // typography
        [
          variant === "primary" && [
            "bg-primary", // background
            "text-white ", // typography
          ],
          variant === "secondary" && [
            "border-2 border-stroke-200", // box model
            "bg-transparent hover:bg-surface/5", // background
            "text-white text-opacity-66", // typography
          ],
          variant === "text" && [
            "bg-transparent hover:bg-surface/5", // background
            "text-primary ", // typography
          ],
        ],
        "disabled: cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
