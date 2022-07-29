import thumbnail from "../../assets/thumbnails/62c743d621bba5244ea32569.jpeg";
import Star from "../../components/icons/Star";

const MangaList = () => {
  return (
    <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-6">
      {Array(18).fill(
        <MangaCard
          title={{ title_ru: "Элисед", title_en: "Eliceed" }}
          thumbnail={thumbnail}
          rating={4.6}
        />
      )}
    </div>
  );
};

interface MangaCardProps {
  title: {
    title_en: string;
    title_ru: string;
  };
  thumbnail: string;
  rating: number;
}

const MangaCard = ({ title, thumbnail, rating }: MangaCardProps) => {
  const { title_en, title_ru } = title;
  return (
    <div className="flex cursor-pointer flex-col space-y-2 rounded-2xl border border-stroke-100 p-3">
      <img
        src={thumbnail}
        alt="lol"
        className="w-full flex-grow rounded-2xl text-white"
      />
      <div className="relative">
        <div className="absolute top-0 right-0 flex flex-row items-center space-x-1 rounded-full bg-surface/10 px-[6px] py-1">
          <Star />
          <p className="text-[10px] text-white/66 ">{rating}</p>
        </div>
        <h3 className="text-sm font-bold text-white ">{title_ru}</h3>
        <h6 className=" text-xs text-white/66">{title_en}</h6>
      </div>
    </div>
  );
};

export default MangaList;
