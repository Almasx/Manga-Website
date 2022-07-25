import Input from "../../components/atoms/atoms/Input";
import MangaFilter from "./MangaFilter";
import MangaList from "./MangaList";

function Catalog() {
  return (
    <div className="h-full min-h-screen bg-black px-[15px] lg:grid lg:grid-cols-12 lg:px-5">
      <div className="pt-8 lg:col-span-9">
        <div className="text-2xl font-bold text-white">Каталог</div>
        <div className="pt-4">
          <Input placeholder="пр: боко на херо академия" />
        </div>
        <MangaFilter />
        <MangaList />
      </div>
    </div>
  );
}

export default Catalog;
