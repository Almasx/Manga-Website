import type { Chapter } from "@prisma/client";
import { Heart } from "iconsax-react";
import Link from "next/link";
import clsx from "clsx";
import { dateOptions } from "utils/formaters";
import { useRouter } from "next/router";
import { useState } from "react";

const ChapterCard = ({
  id,
  chapterIndex,
  volumeIndex,
  createdAt,
  publicAt,
  packed = false,
}: {
  packed?: boolean;
} & Omit<Chapter, "pages" | "comicsId" | "updatedAt">) => {
  const { asPath } = useRouter();
  const premium = publicAt
    ? publicAt.valueOf() - new Date().valueOf() >= 0
    : false;
  console.log(
    "v",
    publicAt && new Date().valueOf() - (publicAt as Date).valueOf()
  );

  return (
    <Link
      href={`${asPath}/chapter/${id}`}
      className={clsx(
        "flex flex-row items-center rounded-2xl border  border-gray-dark-secondary px-5",
        "relative py-3 text-light  duration-100 hover:border-2 hover:border-gray-dark",
        !packed && "bg-dark hover:scale-105",
        packed && "border-gray-dark bg-dark/40 hover:border-white/30"
      )}
    >
      {!packed && premium && (
        <div
          className="absolute top-0  z-10 -translate-x-1 -translate-y-1/2 rounded-md 
        bg-primary px-2 text-xs font-bold text-white "
        >
          PRO
        </div>
      )}
      <p className="mr-2 text-sm font-medium uppercase text-light/60">
        Том {volumeIndex}
      </p>
      <p className="mr-2 text-base font-bold text-light">
        Глава {chapterIndex}
      </p>
      <p
        className={clsx(
          "mr-4 text-sm text-light/60",
          premium && "text-primary"
        )}
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (publicAt ?? createdAt).toLocaleDateString("ru", dateOptions as any)
        }
      </p>
    </Link>
  );
};

export default ChapterCard;
