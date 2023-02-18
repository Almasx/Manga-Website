import Button from "core/ui/primitives/Button";
import CancelCross from "../../../../public/icons/CancelCross.svg";
import CheckBoxField from "core/ui/fields/CheckBoxField";
import SelectGenres from "../../../components/organisms/SelectGenres";
import clsx from "clsx";
import shallow from "zustand/shallow";
import { useFilterStore } from "../../../lib/hooks/useFilterStore";
import useScreen from "../../../lib/hooks/useScreen";

interface IFilterSideBarProps {
  show: boolean;
  setShow: (event?: any) => void;
}

const FilterSideBar = ({ show, setShow }: IFilterSideBarProps) => {
  const { filter, resetFilter, toggleGenre, setStatus, setGenreQuery } =
    useFilterStore((state) => state, shallow);
  const { isDesktop } = useScreen();

  return (
    <aside
      className={clsx(
        "fixed top-0 z-10 -ml-[15px] flex h-[calc(100vh-64px)] flex-col gap-y-10 bg-black/80 px-[15px] pt-8 pb-5 md:mx-0 ",
        "backdrop-blur-2xl md:sticky md:col-span-4 md:col-start-9 md:border-l md:border-stroke-100 md:px-5 lg:col-start-10",
        show && "hidden"
      )}
    >
      {/* Genres */}
      <section className="flex flex-col overflow-hidden rounded-2xl md:grow">
        <h3 className="mb-3 flex flex-row text-xl font-bold text-white md:text-2xl">
          Жанры
          {!isDesktop && show && (
            <button className="ml-auto " onClick={() => setShow(false)}>
              <CancelCross />
            </button>
          )}
        </h3>
        <SelectGenres
          selected={filter.genres.selected}
          query={filter.genres.query}
          onQuery={setGenreQuery}
          onToggleGenre={toggleGenre}
        />
      </section>

      {/* Status */}
      <section className="">
        <h3 className="mb-3 text-xl font-bold text-white md:text-2xl">
          Статус
        </h3>
        <CheckBoxField
          onClick={() => setStatus("ongoing")}
          active={filter.status === "ongoing"}
          key="ongoing"
        >
          Выпускается
        </CheckBoxField>
        <CheckBoxField
          onClick={() => setStatus("abandoned")}
          active={filter.status === "abandoned"}
          key="abandoned"
        >
          Заброшён
        </CheckBoxField>
        <CheckBoxField
          onClick={() => setStatus("finished")}
          active={filter.status === "finished"}
          key="finished"
        >
          Завершён
        </CheckBoxField>
      </section>

      <Button
        variant="text"
        className="absolute bottom-0 mt-auto py-3"
        ripple={false}
        onClick={() => resetFilter()}
      >
        Сбросить все фильтры
      </Button>
    </aside>
  );
};

export default FilterSideBar;
