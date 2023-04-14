import type { IFilterSort } from "../lib/hooks/useFilterStore";
import { useFilterStore } from "../lib/hooks/useFilterStore";
import { useInView } from "react-intersection-observer";

import Button from "core/ui/primitives/Button";
import CatalogLayout from "layout/catalog";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { SearchNormal } from "iconsax-react";
import { TabBar } from "core/ui/primitives/TabBar";
import TextField from "core/ui/fields/TextField";
import TrendUp from "../../public/icons/TrendUp.svg";
import _ from "lodash";
import clsx from "clsx";
import useDebounce from "../lib/hooks/useDebounce";
import ComicsCard, { ComicsCardLoading } from "components/molecules/ComicsCard";
import { api } from "utils/api";

const Catalog = () => {
  const { filter, setSort, setQuery, toggleOrder } = useFilterStore(
    (state) => state
  );
  const debounce = useDebounce();

  return (
    <main className="mr-0 flex flex-col px-4 pt-8 lg:mr-[384px]">
      <h3 className="mb-3 text-xl font-bold text-light md:text-2xl">Каталог</h3>
      <TextField
        placeholder="пр: ванпачмен"
        onChange={(event) => {
          debounce(() => setQuery(event.target.value));
        }}
        endIcon={<SearchNormal size="20" className="text-light/30" />}
      />
      <div className="relative flex w-full flex-row justify-between">
        <TabBar
          onChange={(value: IFilterSort) => {
            setSort(value);
          }}
          tabs={
            [
              { label: "Новое", value: "year" },
              { label: "Читаемые", value: "saved" },
              { label: "Лучшие", value: "ratings" },
            ] satisfies { label: string; value: IFilterSort }[]
          }
        />
        <Button
          variant="secondary"
          content="icon"
          className="top-4 h-9 w-9"
          onClick={() => {
            toggleOrder();
          }}
        >
          <div className={clsx(filter.order === "desc" && "-scale-y-100")}>
            <TrendUp className="block text-primary" />
          </div>
        </Button>
      </div>
      <ComicsList />
    </main>
  );
};

const ComicsList = () => {
  const { filter } = useFilterStore((state) => state);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    api.comics.getCatalog.useInfiniteQuery(
      { limit: 12, ...filter, genres: filter.genres.selected },
      {
        getNextPageParam: (lastComics) => lastComics.nextId,
      }
    );
  const { ref, inView } = useInView();

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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (catalog && catalog.catalog.length === 0) {
    return (
      <div className="flex h-auto grow items-center justify-center text-4xl font-medium text-light/20">
        Манга не найдена...
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-2 gap-5 overflow-y-auto sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6">
      {data &&
        catalog?.catalog.map((comics) => (
          <ComicsCard
            id={comics.id}
            key={comics.id}
            title={{ title_en: comics.title, title_ru: comics.title_ru }}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            {...(comics.thumbnail
              ? { thumbnail: comics.thumbnail }
              : { external_link: comics.external_thumbnail as string })}
            rating={comics.ratings.length}
          />
        ))}
      {isFetching || isFetchingNextPage ? (
        Array(6).fill(<ComicsCardLoading />)
      ) : (
        <div className="col-span-full h-2" ref={ref}></div>
      )}
    </div>
  );
};

Catalog.getLayout = (page: ReactNode) => <CatalogLayout>{page}</CatalogLayout>;

export default Catalog;
