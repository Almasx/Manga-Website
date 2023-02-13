import DashBoardLayout from "pages/layout/dashboard";
import type { ReactNode } from "react";
import { SearchNormal } from "iconsax-react";
import Spinner from "components/ui/primitives/Spinner";
import TextField from "components/ui/fields/TextField";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

const Bookmark = () => {
  const { query } = useRouter();
  const { data: bookmark, isLoading } = trpc.bookmark.getBookmark.useQuery({
    bookmarkId: query.bookmarkId as string,
  });
  console.log(bookmark, query.bookmarkId);

  if (isLoading) {
    return <Spinner></Spinner>;
  }
  return (
    <div className="flex flex-col">
      <div className="relative  mb-12 flex h-52 flex-col justify-center bg-gradient bg-cover px-5 ">
        <h2 className="text-5xl font-bold text-white">{bookmark?.title}</h2>
        <TextField
          name="search"
          className="!absolute bottom-0 left-5 right-5 translate-y-1/2  pt-3"
          placeholder="пр: боко на херо академия"
          // value={filter.query}
          // onChange={(e) => setFilter({ ...filter, query: e.target.value })}
          endIcon={<SearchNormal size="20" className="text-white/30 " />}
        />
      </div>
      {/* <ComicsList /> */}
    </div>
  );
};

Bookmark.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default Bookmark;
