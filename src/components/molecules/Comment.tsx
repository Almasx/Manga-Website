import { ArrowDown2, ArrowUp2 } from "iconsax-react";

import type { User } from "@prisma/client";
import { api } from "utils/api";
import clsx from "clsx";
import { useState } from "react";

interface ICommentProps {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  initialRating: number;
  type: "comics" | "chapter";
}

const Comment = ({
  id,
  content,
  author,
  createdAt,
  initialRating,
  type,
}: ICommentProps) => {
  const [vote, setVote] = useState<"upvote" | "downvote" | null>(null);
  const { data: rating, refetch } =
    type === "comics"
      ? api.comics.getRatingComment.useQuery(
          { commentId: id },
          { initialData: initialRating, enabled: vote !== null }
        )
      : api.chapter.getRatingComment.useQuery(
          { commentId: id },
          { initialData: initialRating, enabled: vote !== null }
        );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess = (_: any, variables: { vote: "upvote" | "downvote" }) => {
    setVote(variables.vote);
    refetch();
  };

  const { mutate: voteComment } =
    type === "comics"
      ? api.comics.postRatingComment.useMutation({ onSuccess })
      : api.chapter.postRatingComment.useMutation({ onSuccess });

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
          <ArrowUp2
            className={clsx(
              "duration-300",
              vote === "upvote" && "text-primary"
            )}
            onClick={() =>
              voteComment({
                commentId: id,
                vote: "upvote",
                votedState: vote !== null,
              })
            }
          />
          {rating}
          <ArrowDown2
            className={clsx(
              "duration-300",
              vote === "downvote" && "text-primary"
            )}
            onClick={() =>
              voteComment({
                commentId: id,
                vote: "downvote",
                votedState: vote !== null,
              })
            }
          />
        </div>
        {/* <ArrowForward className="-scale-x-100 " /> */}
      </div>
    </div>
  );
};

export default Comment;
