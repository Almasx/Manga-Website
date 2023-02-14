import ComicsCard from "../../components/molecules/ComicsCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "components/ui/primitives/Spinner";
import { trpc } from "../../utils/trpc";
import { useFilterStore } from "../../lib/hooks/useFilterStore";
import { useMemo } from "react";
import { useRouter } from "next/router";

const ComicsList = () => {
  const router = useRouter();
  const { filter } = useFilterStore((state) => state);
  const { data, fetchNextPage, hasNextPage, isFetching } =
    trpc.comics.getCatalog.useInfiniteQuery(
      { limit: 2, ...filter, genres: filter.genres.selected },
      {
        getNextPageParam: (lastComics) =>
          lastComics.nextId !== undefined ? lastComics.nextId + 1 : undefined,
      }
    );

  const catalog = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return {
          nextId: page.nextId,
          catalog: [...prev.catalog, ...page.catalog],
        };
      }),
    [data]
  );

  if (catalog === undefined || catalog.catalog.length === 0) {
    return (
      <div className="flex h-auto grow items-center justify-center text-4xl font-medium text-white/20">
        Манга не найдена...
      </div>
    );
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <InfiniteScroll
      dataLength={catalog ? catalog.catalog.length : 0}
      next={() => {
        fetchNextPage();
      }}
      hasMore={!!hasNextPage}
      loader={<>gg</>}
      className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 "
    >
      {data &&
        catalog.catalog.map((comics) => (
          <ComicsCard
            onClick={() => {
              router.push(`/comics/${comics.id}`);
            }}
            title={{ title_en: comics.title, title_ru: comics.title_ru }}
            key={comics.title}
            thumbnail={comics.thumbnail}
            rating={comics.rating}
          />
        ))}
    </InfiniteScroll>
  );
};

export default ComicsList;
