import { SearchNormal } from "iconsax-react";
import clsx from "clsx";

import TextField from "../components/atoms/TextField";
import Button from "../components/atoms/Button";
import TabBar from "../components/atoms/TabBar";
import ComicsList from "../components/organisms/ComicsList";

import TrendUp from "../../public/icons/TrendUp.svg";
import type { ReactNode } from "react";
import CatalogLayout from "../layout/catalog";
import { useFilterStore } from "../hooks/useFilterStore";
import useDebounce from "../hooks/useDebounce";

const Catalog = () => {
  const { filter, setSort, setQuery, toggleOrder } = useFilterStore(
    (state) => state
  );
  const debounce = useDebounce();

  return (
    <main className="col-span-4 flex flex-col pl-4 pt-8 md:col-span-8 lg:col-span-9">
      <h3 className="text-xl font-bold text-white md:text-2xl">Каталог</h3>
      <TextField
        className="pt-3"
        placeholder="пр: ванпачмен"
        onChange={(event) => debounce(event.target.value, setQuery)}
        endIcon={<SearchNormal size="20" className="text-white/33 " />}
      />
      <div className="relative flex w-full flex-row justify-between">
        <TabBar
          onChange={(value) => {
            setSort(value);
          }}
          tabs={[
            { label: "Новое", value: "year" },
            { label: "Читаемые", value: "save" },
            { label: "Лучшие", value: "rating" },
          ]}
        />
        <Button
          variant="secondary"
          content="icon"
          className="top-4 h-8 w-8"
          onClick={() => {
            toggleOrder();
          }}
        >
          <div className={clsx(filter.order === "desc" && "-scale-y-100")}>
            <TrendUp className="block h-[11px] w-[17px] fill-primary" />
          </div>
        </Button>
      </div>
      <ComicsList />
    </main>
  );
};

Catalog.getLayout = (page: ReactNode) => <CatalogLayout>{page}</CatalogLayout>;

export default Catalog;
