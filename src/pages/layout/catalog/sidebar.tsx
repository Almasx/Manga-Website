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
  const { isDesktop, isPhone } = useScreen();

  return (
    <aside
      className={clsx(
        "fixed top-16 z-10 flex h-[calc(100vh-64px)] flex-col gap-y-10 bg-dark/20 px-[15px] pt-8 pb-5 lg:mx-0 ",
        "right-0 w-screen backdrop-blur-lg lg:w-96 lg:border-l lg:border-gray-dark-secondary lg:px-5 ",
        !show && !isDesktop && "hidden"
      )}
    >
      {/* Genres */}
      <section className="flex flex-col overflow-hidden rounded-2xl lg:grow">
        <h3 className="mb-3 flex flex-row text-xl font-bold text-light lg:text-2xl">
          Жанры
          {!isDesktop && (
            <button className="ml-auto" onClick={() => setShow(false)}>
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
        <h3 className="mb-3 text-xl font-bold text-light lg:text-2xl">
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
        className="absolute bottom-0 mt-auto !bg-transparent py-3"
        ripple={false}
        onClick={() => resetFilter()}
      >
        Сбросить все фильтры
      </Button>
    </aside>
  );
};

export default FilterSideBar;
