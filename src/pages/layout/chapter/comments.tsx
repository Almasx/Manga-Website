import CommentField from "components/molecules/CommentField";
import Comments from "components/molecules/Comments";
import SideBar from "components/ui/templates/SideBar";

const CommentsSection = () => {
  return (
    <SideBar.Wrapper className="w-96">
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
