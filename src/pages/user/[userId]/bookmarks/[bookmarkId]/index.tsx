import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import ComicsCard from "components/molecules/ComicsCard";
import DashBoardLayout from "pages/layout/dashboard";
import type { ReactNode } from "react";
import { SearchNormal } from "iconsax-react";
import Spinner from "core/ui/primitives/Spinner";
import TextField from "core/ui/fields/TextField";
import { appRouter } from "server/trpc/router/_app";
import { createContextInner } from "server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getSession } from "next-auth/react";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import useDebounce from "lib/hooks/useDebounce";
import { useState } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ bookmarkId: string }>
) => {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: createContextInner({ session: await getSession(context) }),
    transformer: superjson,
  });

  const bookmarkId = context.params?.bookmarkId as string;

  try {
    const bookmark = await ssgHelper.bookmark.getBookmark.fetch({ bookmarkId });
    return {
      props: {
        trpcState: ssgHelper.dehydrate(),
        bookmark,
        bookmarkId,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

const Bookmark = ({
  bookmark: { title },
  bookmarkId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const debounce = useDebounce();

  const [searchQuery, setSearchQuery] = useState("");
  const { data: bookmark, isLoading } = trpc.bookmark.getBookmark.useQuery({
    bookmarkId: bookmarkId,
    query: searchQuery,
  });

  return (
    <>
      <div className="relative -mx-4 mb-12 -mt-3 flex h-52 flex-col justify-center bg-gradient bg-cover px-5 ">
        <h2 className="text-5xl font-bold text-light">{title}</h2>
        <TextField
          name="search"
          className="bg-b !absolute bottom-0 left-5 right-5 translate-y-1/2"
          placeholder="пр: боко на херо академия"
          onChange={(e) =>
            debounce(() => {
              console.log(e.target.value);
              setSearchQuery(e.target.value);
            })
          }
          endIcon={<SearchNormal size="20" className="text-light/30 " />}
        />
      </div>

      <div className="grid grid-cols-6 gap-5 ">
        {isLoading ? (
          <Spinner />
        ) : (
          bookmark?.comics?.map((comics) => (
            <ComicsCard
              id={comics.id}
              title={{ title_en: comics.title, title_ru: comics.title_ru }}
              key={comics.title}
              thumbnail={comics.thumbnail}
            />
          ))
        )}
      </div>
    </>
  );
};

Bookmark.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default Bookmark;
