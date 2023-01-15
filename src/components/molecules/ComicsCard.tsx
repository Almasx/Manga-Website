import type { Thumbnail } from "@prisma/client";
import clsx from "clsx";
import Star from "../../../public/icons/Star.svg";

export interface ComicsCardProps {
  title: {
    title_en: string;
    title_ru: string;
  };
  onClick?: (e: unknown) => void;
  thumbnail: Thumbnail | null;
  rating?: number;
  variant?: "recomendation" | "catalog";
}

const ComicsCard = ({
  title,
  onClick,
  thumbnail,
  rating,
  variant = "catalog",
}: ComicsCardProps) => {
  const { title_en, title_ru } = title;
  return (
    <button
      onClick={(e) => {
        onClick && onClick(e);
      }}
      className={clsx(
        "flex cursor-pointer rounded-2xl text-left",
        "border border-stroke-100 p-3 ",
        [
          variant === "catalog" && "flex-col gap-y-2",
          variant === "recomendation" && "flex-row gap-x-3",
        ]
      )}
    >
      <div
        className={clsx(
          "relative grow ",
          variant === "recomendation" && "aspect-square w-2/5"
        )}
      >
        <img
          src={thumbnail.id}
          alt="lol"
          className="h-full w-full rounded-2xl text-white"
        />
        {rating && (
          <div
            className={clsx(
              "flex flex-row items-center gap-x-1 bg-black/80 px-[6px] py-1 backdrop-blur-2xl",
              "absolute bottom-0 right-0 rounded-tl-xl rounded-br-md"
            )}
          >
            <Star />
            <p className="text-[10px] text-white/60 ">{rating.toFixed(1)}</p>
          </div>
        )}
      </div>

      <div
        className={clsx(
          variant === "catalog" && "relative",
          variant === "recomendation" && "flex-grow"
        )}
      >
        <h3
          className={clsx(
            " font-bold text-white",
            variant === "catalog" && "text-sm",
            variant === "recomendation" && "text-base"
          )}
        >
          {title_ru}
        </h3>
        <h6 className=" text-xs text-white/60">{title_en}</h6>
      </div>
    </button>
  );
};

export default ComicsCard;