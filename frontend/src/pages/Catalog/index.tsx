import { SearchNormal } from "iconsax-react";
import Input from "../../components/atoms/Input";
import MangaFilter from "./MangaFilter";
import MangaList from "./MangaList";
import CheckBox from "../../components/atoms/CheckBox";
import Badge from "../../components/atoms/Badge";

function Catalog() {
  return (
    <div className="h-full min-h-screen gap-5 bg-black px-[15px] lg:grid lg:grid-cols-12 lg:px-5 ">
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
      <div className=" border-stroke-100 pt-8 lg:col-span-3 lg:col-start-10 lg:border-l lg:px-5">
        <h3 className="text-xl font-bold text-white lg:text-2xl">Жанры</h3>
        <Input
          className="pt-3"
          placeholder="пр: детектив, драма..."
          endIcon={<SearchNormal size="20" className="text-white/33 " />}
        />
        <div className="flex flex-row flex-wrap items-center justify-start pt-4">
          {Array(20).fill(<Badge className="mr-2 mb-2">боевик</Badge>)}
        </div>
        {/* <CheckBox></CheckBox> */}
      </div>
    </div>
  );
}

export default Catalog;
