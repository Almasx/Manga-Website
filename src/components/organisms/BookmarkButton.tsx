import Button from "core/ui/primitives/Button";
import DropDown from "core/ui/primitives/DropDown";
import { Save2 } from "iconsax-react";
import Tab from "core/ui/templates/SideBar/Section/Tab";
import { trpc } from "utils/trpc";
import { useSession } from "next-auth/react";

export const BookmarkButton = ({ comicsId }: { comicsId: string }) => {
  const session = useSession();
  const { data: user } = trpc.auth.getBookmarks.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { mutate: addBookmark } = trpc.bookmark.addBookmark.useMutation();

  if (session.data?.user?.role !== "USER" || !user?.bookmarks) {
    return <></>;
  }
  return (
    <DropDown
      header={
        <Button variant="text" content="icon" className="aspect-square w-10 ">
          <div className="scale-125">
            <Save2 />
          </div>
        </Button>
      }
      options={user.bookmarks.map((bookmark) => (
        <Tab
          active={false}
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
