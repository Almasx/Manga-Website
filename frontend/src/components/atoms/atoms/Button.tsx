import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";

interface Props {
  variant?: "primary" | "secondary" | "text";
  children: ReactNode;
  onClick?: (event?: any) => void;
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
        "box-content rounded-xl px-3 py-2 m-2", // box-model
        "font-bold text-center", // typography
        "overflow-hidden relative", // others
        [
          variant === "primary" && [
            "bg-primary", // background
            "text-white ", // typography
          ],
          variant === "secondary" && [
            "border-2 border-stroke-200", // box model
            "bg-transparent hover:bg-surface/5", // background
            "text-white/66", // typography
          ],
          variant === "text" && [
            "bg-transparent hover:bg-surface/5", // background
            "text-primary ", // typography
          ],
        ],
        disabled && "disabled: cursor-not-allowed"
      )}
    >
      {isRippling && (
        <span
          className="w-5 h-5 absolute block rounded-full bg-white/20 opacity-100 animate-ripple-effect"
          style={{ left: coords.x, top: coords.y }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
