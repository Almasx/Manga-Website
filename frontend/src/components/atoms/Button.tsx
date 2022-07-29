import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "text";
  content?: "text" | "icon";
  children: ReactNode;
  onClick?: (event?: any) => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  content = "text",
  className = "",
  disabled = false,
}: ButtonProps) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState<boolean>(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 300);
    } else setIsRippling(false);
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  return (
    <button
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        setCoords({ x: event.clientX - left, y: event.clientY - top });
        console.log(coords);
        onClick && onClick(event);
      }}
      disabled={disabled}
      className={clsx(
        className,
        "rounded-xl",
        "relative overflow-hidden", // others
        [
          content === "text" && [
            "box-content px-3 py-2",
            "text-center font-bold",
          ],
          content === "icon" && ["box-border grid place-items-center"],
        ],
        [
          variant === "primary" && [
            "bg-primary", // background
            content === "text" && "text-white ", // typography
          ],
          variant === "secondary" && [
            "border border-stroke-200", // box model
            "bg-transparent hover:bg-surface/5", // background
            content === "text" && "text-white/66", // typography
          ],
          variant === "text" && [
            "bg-transparent hover:bg-surface/5", // background
            content === "text" && "text-primary ", // typography
          ],
        ],
        disabled && "disabled: cursor-not-allowed"
      )}
    >
      {isRippling && (
        <span
          className="absolute block h-5 w-5 animate-ripple-effect rounded-full bg-white/20 opacity-100"
          style={{ left: coords.x, top: coords.y }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
