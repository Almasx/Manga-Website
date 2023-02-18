import CommentField from "components/molecules/CommentField";
import Comments from "components/molecules/Comments";
import SideBar from "core/ui/templates/SideBar";

const CommentsSection = () => {
  return (
    <SideBar.Wrapper className="sticky top-16 !w-96 flex-shrink-0">
      <SideBar.Section.Wrapper>
        <SideBar.Section.Header text="Комментарий" />
        <div className="flex flex-col gap-5 px-5">
          <CommentField />
          <Comments />
          <Comments />
          <Comments />
        </div>
      </SideBar.Section.Wrapper>
    </SideBar.Wrapper>
  );
};

export default CommentsSection;
