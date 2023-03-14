import Button from "core/ui/primitives/Button";
import CatalogLayout from "./layout/catalog";
import ComicsList from "../components/organisms/ComicsList";
import type { ReactNode } from "react";
import { SearchNormal } from "iconsax-react";
import { TabBar } from "core/ui/primitives/TabBar";
import TextField from "core/ui/fields/TextField";
import TrendUp from "../../public/icons/TrendUp.svg";
import _ from "lodash";
import clsx from "clsx";
import useDebounce from "../lib/hooks/useDebounce";
import { useFilterStore } from "../lib/hooks/useFilterStore";

const Catalog = () => {
  const { filter, setSort, setQuery, toggleOrder } = useFilterStore(
    (state) => state
  );
  const debounce = useDebounce();

  return (
    <main className="mr-0 flex h-[calc(100vh-64px)] flex-col px-4 pt-8 lg:mr-[384px]">
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
          onChange={(value: "rating" | "saved" | "year") => {
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

Catalog.getLayout = (page: ReactNode) => <CatalogLayout>{page}</CatalogLayout>;

export default Catalog;
