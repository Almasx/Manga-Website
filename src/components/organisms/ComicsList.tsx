import ComicsCard from "../../components/molecules/ComicsCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "core/ui/primitives/Spinner";
import { trpc } from "../../utils/trpc";
import { useFilterStore } from "../../lib/hooks/useFilterStore";
import { useMemo } from "react";

const ComicsList = () => {
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

  if (isFetching) {
    return <Spinner />;
  }

  if (catalog === undefined || catalog.catalog.length === 0) {
    return (
      <div className="flex h-auto grow items-center justify-center text-4xl font-medium text-white/20">
        Манга не найдена...
      </div>
    );
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
            id={comics.id}
            key={comics.id}
            title={{ title_en: comics.title, title_ru: comics.title_ru }}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            thumbnail={comics.thumbnail!}
            rating={comics.rating}
          />
        ))}
    </InfiniteScroll>
  );
};

export default ComicsList;
