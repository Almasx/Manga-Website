import type { Chapter } from "@prisma/client";
import clsx from "clsx";
import { Heart, Lock1 } from "iconsax-react";
import { useRouter } from "next/router";
import { useState } from "react";

const ChapterCard = ({
  id,
  volume,
  createdAt,
  packed = false,
}: {
  id: number;
  volume: number;
  createdAt: Chapter["createdAt"];
  packed?: boolean;
}) => {
  const [liked, setLiked] = useState<boolean>(false);
  const router = useRouter();

  return (
    <button
      className={clsx(
        " flex flex-row items-center rounded-2xl border border-stroke-100  px-5",
        "py-3 text-white duration-100  hover:border-stroke-200",
        !packed && "-ml-10 bg-black hover:scale-105",
        packed && "border-stroke-200 bg-black/40 hover:border-white/30"
      )}
      onClick={() => {
        router.push(`chapter/${id}`);
      }}
    >
      {!packed && <Lock1 size="24" className="mr-4 text-white/30" />}
      <p className="mr-2 text-sm font-medium uppercase text-white/60">
        Том {volume}
      </p>
      <p className="mr-2 text-base font-bold text-white">Глава {id}</p>
      <p className="mr-4 text-sm text-white/60">{createdAt.getMonth()}</p>

      {/* VIP */}
      {/* {!access && (
        <p className="text-sm text-primary">Бесплатно через 7 дней</p>
      )} */}
      {!packed && <p className="font-meduim ml-auto mr-3">44</p>}
      {!packed && (
        <button
          onClick={() => {
            setLiked(!liked);
          }}
        >
          <Heart
            size="24"
            className="text-primary"
            variant={liked ? "Bold" : "Linear"}
          />
        </button>
      )}
    </button>
  );
};

export default ChapterCard;
