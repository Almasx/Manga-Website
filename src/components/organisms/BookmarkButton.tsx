import Button from "core/ui/primitives/Button";
import DropDown from "core/ui/primitives/DropDown";
import Save from "../../../public/icons/Save.svg";
import { Tab } from "core/ui/templates/SideBar/Section";
import { api } from "utils/api";
import clsx from "clsx";
import { useSession } from "next-auth/react";

export const BookmarkButton = ({ comicsId }: { comicsId: string }) => {
  const session = useSession();
  const { data: user } = api.user.getBookmarks.useQuery();
  const { mutate: addBookmark } = api.bookmark.addBookmark.useMutation();

  if (session.data?.user?.role !== "USER" || !user?.bookmarks) {
    return <></>;
  }
  return (
    <DropDown
      header={
        <Button
          variant="text"
          content="icon"
          className="aspect-square w-10 hover:bg-light/10"
        >
          <Save />
        </Button>
      }
      options={user.bookmarks.map((bookmark, index) => (
        <Tab
          active={false}
          className="hover:bg-light/10"
          activeClassName={clsx(
            "border-b border-t border-primary bg-primary/20 text-light hover:!bg-primary/30",
            index === 0 && "border rounded-t-xl",
            index === user.bookmarks.length - 1 && "border rounded-b-xl"
          )}
          key={bookmark.id}
          onClick={() =>
            addBookmark({
              bookmarkId: bookmark.id,
              comicsId: comicsId,
            })
          }
        >
          {bookmark.title}
        </Tab>
      ))}
    />
  );
};
