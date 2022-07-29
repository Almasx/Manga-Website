import Button from "../../components/atoms/Button";
import TabBar from "../../components/atoms/TabBar";
import TrendUp from "../../components/icons/TrendUp";

const MangaFilter = () => {
  const tabs: string[] = [
    "Новые",
    "Рекомедованные",
    "Популярные",
    "Читаемые",
    "По рейтингу",
    "По лайкам",
  ];
  return (
    <div className="relative flex w-full flex-row justify-between">
      <TabBar tabs={tabs} />
      <Button variant="secondary" content="icon" className="top-4 h-8 w-8">
        <TrendUp />
      </Button>
    </div>
  );
};

export default MangaFilter;
