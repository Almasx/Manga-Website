import Link from "next/link";
import Star from "../../../public/icons/Star2.svg";
import type { Thumbnail } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";

export type IThumbnail =
  | {
      thumbnail: Thumbnail;
      external_link?: string;
    }
  | {
      thumbnail?: Thumbnail;
      external_link: string;
    };

export type ComicsCardProps = {
  id: string;
  title: {
    title_en: string;
    title_ru: string;
  };
  rating?: number;
  variant?: "recomendation" | "catalog" | "bookmark";
} & IThumbnail;

const ComicsCard = ({
  id,
  title,
  thumbnail,
  external_link,
  rating,
  variant = "catalog",
}: ComicsCardProps) => {
  const { title_en, title_ru } = title;
  const [showMore, setShowMore] = useState<boolean>(false);

  const header = (
    <div
      className={clsx(
        variant === "catalog" && "relative",
        variant === "recomendation" && "w-[calc(50%-20px)]"
      )}
    >
      <h3
        className={clsx(
          "font-bold text-light",
          variant === "catalog" && "text-sm",
          variant === "recomendation" && "text-base"
        )}
      >
        {title_ru.substring(0, 15)}
        {title_ru.length > 14 && "..."}
      </h3>
      <h6 className=" text-xs text-light/60">{title_en}</h6>
    </div>
  );

  return (
    <Link
      href={`/comics/${id}`}
      onMouseEnter={() => variant === "bookmark" && setShowMore(true)}
      onMouseLeave={() => variant === "bookmark" && setShowMore(false)}
      className={clsx(
        "flex cursor-pointer rounded-2xl bg-dark text-left",
        "relative z-10 border border-gray-dark-secondary p-3",
        [
          variant === "catalog" && "gap-y-2 ",
          variant === "recomendation" && "grow gap-x-3",
          variant === "bookmark" &&
            "gap-y-2 hover:col-span-2  hover:grid hover:grid-cols-2",
        ]
      )}
    >
      <div
        className={clsx(
          "flex gap-3",
          variant === "recomendation" ? "grow" : "flex-col"
        )}
      >
        <div
          className={clsx(
            "relative ",
            variant === "recomendation" && "aspect-square w-1/2 grow"
          )}
        >
          <img
            src={
              external_link ??
              `https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnail?.id}`
            }
            alt="lol"
            className={clsx(
              "w-full rounded-2xl bg-gray-dark-secondary text-light",
              variant === "catalog" ? "aspect-[3/5]" : "h-full"
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

        {!showMore && header}
        {showMore && (
          <Link
            className="flex grow"
            href={`${"asPath"}/chapter/${"lastChapterId"}`}
          >
            <div
              className="flex grow items-center justify-center rounded-xl
                          bg-light py-2 text-sm font-bold text-dark"
            >
              Начать читать
            </div>
          </Link>
        )}
      </div>

      {showMore && <div className="grow bg-primary ">{header}</div>}
    </Link>
  );
};

export const ComicsCardLoading = ({
  variant = "catalog",
}: {
  variant?: "recomendation" | "catalog";
}) => (
  <div
    className={clsx(
      "relative z-10 flex cursor-pointer rounded-2xl bg-dark text-left",
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
      <div
        className={clsx(
          "h-full w-full animate-pulse rounded-2xl text-light",
          " flex h-48 items-center justify-center rounded bg-gray-300 dark:bg-dark-tertiary",
          variant === "catalog" && "mb-4 aspect-[3/4]"
        )}
      >
        <svg
          className="h-12 w-12 text-gray-200 dark:text-gray-dark"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 640 512"
        >
          <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
        </svg>
      </div>
    </div>

    <div
      className={clsx(
        variant === "catalog" && "relative",
        variant === "recomendation" && "grow pt-1"
      )}
    >
      {/* <h3
        className={clsx(
          " font-bold text-light",
          variant === "catalog" && "text-sm",
          variant === "recomendation" && "text-base"
        )}
      >
        {title_ru}
      </h3> */}
      <div className="mb-2 h-2.5 w-24 animate-pulse  rounded-full bg-gray-300 dark:bg-gray-dark-secondary" />
      <div className="h-2 w-32 animate-pulse  rounded-full bg-gray-200 dark:bg-gray-dark" />
    </div>
  </div>
);

export default ComicsCard;
