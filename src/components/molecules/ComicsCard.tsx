import Link from "next/link";
import Star from "../../../public/icons/Star2.svg";
import type { Thumbnail } from "@prisma/client";
import clsx from "clsx";

export interface ComicsCardProps {
  id: string;
  title: {
    title_en: string;
    title_ru: string;
  };
  thumbnail: Thumbnail;
  rating?: number;
  variant?: "recomendation" | "catalog";
}

const ComicsCard = ({
  id,
  title,
  thumbnail,
  rating,
  variant = "catalog",
}: ComicsCardProps) => {
  const { title_en, title_ru } = title;
  return (
    <Link
      href={`/comics/${id}`}
      className={clsx(
        "flex cursor-pointer rounded-2xl text-left",
        "border border-gray-dark-secondary p-3 ",
        [
          variant === "catalog" && "flex-col gap-y-2",
          variant === "recomendation" && "grow flex-row gap-x-3",
        ]
      )}
    >
      <div
        className={clsx(
          "relative grow",

          variant === "recomendation" && "aspect-square w-2/5"
        )}
      >
        <img
          src={`https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnail?.id}`}
          alt="lol"
          className={clsx(
            "h-full w-full rounded-2xl text-light",
            variant === "catalog" && "aspect-[3/4]"
          )}
        />
        {rating !== undefined && (
          <div
            className={clsx(
              "flex flex-row items-center gap-x-1 bg-dark/80 px-[6px] py-1 backdrop-blur-2xl",
              "absolute bottom-0 right-0 rounded-tl-xl rounded-br-md"
            )}
          >
            <Star />
            <p className="text-xs text-light/60 ">{rating.toFixed(1)}</p>
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
            " font-bold text-light",
            variant === "catalog" && "text-sm",
            variant === "recomendation" && "text-base"
          )}
        >
          {title_ru}
        </h3>
        <h6 className=" text-xs text-light/60">{title_en}</h6>
      </div>
    </Link>
  );
};

export default ComicsCard;
