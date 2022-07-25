import TabBar from "../../components/atoms/atoms/TabBar";

const MangaCategory = () => {
  const tabs: string[] = [
    "Новые",
    "Рекомедованные",
    "Популярные",
    "Читаемые",
    "По рейтингу",
    "По лайкам",
  ];
  return <TabBar tabs={tabs} />;
};

export default MangaCategory;
