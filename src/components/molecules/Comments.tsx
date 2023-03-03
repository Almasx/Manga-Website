import { ArrowDown2, ArrowForward, ArrowUp2 } from "iconsax-react";

import type { User } from "@prisma/client";

interface ICommentProps {
  content: string;
  author: User;
  createdAt: Date;
  rating: number;
}

const Comment = ({ content, author, createdAt, rating }: ICommentProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-dark p-4 text-light ">
      <div className="flex flex-row items-center gap-3">
        <img className="h-9 w-9 rounded-full" src="/images/pfp.png" alt="" />
        <div className="flex flex-col">
          <h1 className="text-sm font-medium text-light">{author.name}</h1>
          <h3 className="text-xs text-light/30">
            {`${createdAt.getDate()} ${createdAt.toLocaleString("default", {
              month: "long",
            })} ${createdAt.getFullYear()}`}
          </h3>
        </div>
      </div>
      <p className="font-base leading-5 text-light/60">{content}</p>
      <div className="flex flex-row gap-5 ">
        <div className="flex flex-row gap-3">
          <ArrowUp2 /> {rating} <ArrowDown2 />
        </div>
        {/* <ArrowForward className="-scale-x-100 " /> */}
      </div>
    </div>
  );
};

export default Comment;
