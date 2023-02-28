import { ArrowDown2, ArrowForward, ArrowUp2 } from "iconsax-react";

interface ICommentProps {
  content: string;
  author: string;
  createdAt: Date;
  rating: number;
}

const Comment = ({ content, author, createdAt, rating }: ICommentProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stroke-200 p-4 text-white ">
      <div className="flex flex-row items-center gap-3">
        <img className="h-9 w-9 rounded-full" src="/images/pfp.png" alt="" />
        <div className="flex flex-col">
          <h1 className="text-sm font-medium text-white">{author}</h1>
          <h3 className="text-xs text-white/30">
            {`${createdAt.getDate()} ${createdAt.toLocaleString("default", {
              month: "long",
            })} ${createdAt.getFullYear()}`}
          </h3>
        </div>
      </div>
      <p className="font-base leading-5 text-white/60">{content}</p>
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
