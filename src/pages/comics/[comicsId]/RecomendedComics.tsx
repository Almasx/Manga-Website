import MangaCard from "../../components/molecules/ComicsCard";
import thumbnail from "../../assets/thumbnails/62c743d621bba5244ea32569.jpeg";

const RecomendedComics = () => {
  return (
    <section className="col-span-2">
      <h3 className="pb-5 text-2xl font-bold text-white">Похожие</h3>
      <div className="flex flex-col gap-4">
        {Array(5).fill(
          <MangaCard
            rating={4.6}
            thumbnail={thumbnail}
            title={{ title_ru: "Элисед", title_en: "Eliceed" }}
            variant="recomendation"
          ></MangaCard>
        )}
      </div>
    </section>
  );
};

export default RecomendedComics;
