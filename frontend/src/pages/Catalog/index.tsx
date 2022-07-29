import { SearchNormal } from "iconsax-react";
import Input from "../../components/atoms/Input";
import MangaFilter from "./MangaFilter";
import MangaList from "./MangaList";
import CheckBox from "../../components/atoms/CheckBox";

function Catalog() {
  return (
    <div className="h-full min-h-screen gap-5 bg-black px-[15px] lg:grid lg:grid-cols-12 lg:px-5  ">
      <div className="pt-8 lg:col-span-9">
        <h3 className="text-xl font-bold text-white lg:text-2xl">Каталог</h3>
        <Input
          className="pt-3"
          placeholder="пр: боко на херо академия"
          endIcon={<SearchNormal size="20" className="text-white/33 " />}
        />
        <MangaFilter />
        <MangaList />
      </div>
      <div className="border-stroke-100 pt-8 lg:col-span-3 lg:col-start-10 lg:border-l lg:px-5">
        <h3 className="text-xl font-bold text-white lg:text-2xl">Жанры</h3>
        <Input
          className="pt-3"
          placeholder="пр: детектив, драма..."
          endIcon={<SearchNormal size="20" className="text-white/33 " />}
        />
        {/* <div className="flex items-center mb-4">
    <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
</div> */}
        <CheckBox></CheckBox>
      </div>
    </div>
  );
}

export default Catalog;
