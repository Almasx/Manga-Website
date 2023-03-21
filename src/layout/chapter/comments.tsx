import Comment from "components/molecules/Comment";
import CommentField from "components/molecules/CommentField";
import SideBar from "core/ui/templates/SideBar";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useState } from "react";

const CommentsSection = () => {
  const { query } = useRouter();
  const [comment, setComment] = useState<string | undefined>(undefined);
  const { data: chapter, refetch } = trpc.chapter.getComments.useQuery({
    chapterId: query.chapterId as string,
    comicsId: query.comicsId as string,
  });

  const { mutate: commentMutate } =
    trpc.comments.postCommentOnChapter.useMutation({
      onSuccess: () => refetch(),
    });

  return (
    <SideBar.Wrapper className="sticky top-16 !w-96 flex-shrink-0">
      <SideBar.Section.Wrapper>
        <SideBar.Section.Header text="Комментарий" />
        <div className="flex flex-col gap-5 px-5">
          <CommentField
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            onClick={() =>
              comment &&
              commentMutate({
                chapterId: query.chapterId as string,
                content: comment,
              })
            }
          />
          {chapter?.comments?.map((comment) => (
            <Comment key={comment.id} {...comment} rating={10} />
          ))}
        </div>
      </SideBar.Section.Wrapper>
    </SideBar.Wrapper>
  );
};

export default CommentsSection;
