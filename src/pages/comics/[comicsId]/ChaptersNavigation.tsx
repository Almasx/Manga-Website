import { useAppSelector } from "../../app/hooks";
import Button from "../../components/atoms/Button";
import { TrendUpBulk } from "../../components/icons/TrendUp";
import ChapterCard from "../../components/molecules/ChapterCard";

const ChaptersNavigation = () => {
  const { comics, isSuccess } = useAppSelector((state) => state.comics);
  return (
    <aside className="col-span-4 row-span-2  bg-gradient bg-cover px-5 pt-8 lg:-mr-5">
      <div className="flex flex-row items-center gap-5 pb-8 text-4xl font-bold text-white">
        <h1>Cписок глав</h1>
        <p>{isSuccess && comics.chapters.length}</p>
        <Button
          variant="primary"
          content="icon"
          className="ml-auto -mt-0 h-11 w-11 rounded-2xl bg-white/20"
        >
          <TrendUpBulk />
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {isSuccess &&
          comics.chapters.map((chapter: IChapter) => (
            <ChapterCard chapter={chapter} />
          ))}
      </div>
    </aside>
  );
};

export default ChaptersNavigation;
