import DashBoardLayout from "pages/layout/dashboard";
import type { ReactNode } from "react";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

const Bookmark = () => {
  const { query } = useRouter();
  const { data: bookmark } = trpc.bookmark.getBookmark.useQuery({
    bookmarkId: query.bookmarkId as string,
  });
  return <div>Bookmark</div>;
};

Bookmark.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default Bookmark;
