import { Heart, Lock1 } from "iconsax-react";

import type { Chapter } from "@prisma/client";
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
  premium = false,
  packed = false,
}: {
  id: string;
  chapterIndex: number;
  volumeIndex: number;
  createdAt: Date;
  premium?: boolean;
  packed?: boolean;
}) => {
  const { asPath } = useRouter();

  return (
    <Link
      href={`${asPath}/chapter/${id}`}
      className={clsx(
        " flex flex-row items-center rounded-2xl border  border-gray-dark-secondary px-5",
        "py-3 text-light duration-100  hover:border-gray-dark",
        !packed && "bg-dark hover:scale-105",
        packed && "border-gray-dark bg-dark/40 hover:border-white/30"
      )}
    >
      {!packed && premium && <Lock1 size="24" className="mr-4 text-light/30" />}
      <p className="mr-2 text-sm font-medium uppercase text-light/60">
        Том {volumeIndex}
      </p>
      <p className="mr-2 text-base font-bold text-light">
        Глава {chapterIndex}
      </p>
      <p className="mr-4 text-sm text-light/60">
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          createdAt.toLocaleDateString("ru", dateOptions as any)
        }
      </p>

      {/* VIP */}
      {!premium && (
        <p className="text-sm text-primary">Бесплатно через 7 дней</p>
      )}
    </Link>
  );
};

export default ChapterCard;
