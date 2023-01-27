import { useRouter } from "next/router";
import CommentField from "../../../components/molecules/CommentField";
import Comments from "../../../components/molecules/Comments";
import superjson from "superjson";

import { Eye, Save2, Star1 } from "iconsax-react";
import TrendUpBulk from "../../../../public/icons/TrendUpBulk.svg";
import Button from "../../../components/atoms/Button";
import type {
  GetServerSidePropsContext,
  InferGetStaticPropsType,
} from "next/types";

import { trpc } from "../../../utils/trpc";
import Badge from "../../../components/atoms/Badge";
import { createContextInner } from "../../../server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import ComicsCard from "../../../components/molecules/ComicsCard";
import ChapterCard from "../../../components/molecules/ChapterCard";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ comicsId: string }>
) {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: createContextInner({ session: null }),
    transformer: superjson,
  });
  const comicsId = parseInt(context.params?.comicsId as string);

  await ssgHelper.comics.getComics.prefetch({ comicsId });
  return {
    props: {
      trpcState: ssgHelper.dehydrate(),
      comicsId,
    },
  };
}

const Comics = ({
  comicsId,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const { data: comics, isLoading } = trpc.comics.getComics.useQuery({
    comicsId,
  });

  return (
    <>
      <section className="grid grid-cols-8 gap-5 pt-8 lg:col-span-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-5">
            {/* {(
            <img
              src={comics.thumbnail}
              alt="lol"
              className="w-full rounded-2xl text-white"
            />
          )} */}
            <div className="relative flex flex-row gap-5">
              <Button className="flex-grow">Начать читать</Button>
              <Button
                variant="text"
                content="icon"
                className="aspect-square w-10 "
              >
                <div className="scale-125">
                  <Save2 />
                </div>
              </Button>
              {/* <DropDown
              header={
                
              }
              options={user.bookmarks.map(
                (bookmark: { id: string; title: string }) => (
                  <Tab active={false} onClick={() => onBookmark(bookmark.id)}>
                    {bookmark.title}
                  </Tab>
                )
              )}
            ></DropDown> */}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-5 pr-10  lg:col-span-6">
          <div className="">
            <h1 className="pb-1 text-4xl font-bold text-white">
              {comics?.title_ru}
            </h1>
            <h3 className="text-white/33 text-2xl font-bold">
              {comics?.title}
            </h3>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {comics?.genres?.map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
          </div>
          <p className="text-sm text-white">{comics?.description}</p>
          <div className="mt-auto grid grid-cols-4">
            <div>
              <h4 className="text-white/33 text-base font-medium">Статус</h4>
              <h3 className="text-lg font-bold text-white">{comics?.status}</h3>
            </div>
            <div>
              <h4 className="text-white/33 text-base font-medium">Выпуск</h4>
              <h3 className="text-lg font-bold text-white">{comics?.year}</h3>
            </div>
            <div>
              <h4 className="text-white/33 text-base font-medium">
                Просмотренно
              </h4>
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                13.4k <Eye size="24" className="text-white/33" />
              </h3>
            </div>
            <div>
              <h4 className="text-white/33 text-base font-medium">
                Сохранённые
              </h4>
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                {comics?.saved}
                <Save2 size="24" className="text-white/33" />
              </h3>
            </div>
          </div>
          <div className="absolute top-0 right-10 flex items-center gap-2 text-3xl font-bold text-primary">
            {comics?.rating}
            <div className="scale-[1.7]">
              <Star1 />
            </div>
          </div>
        </div>
      </section>

      <aside className="col-span-4 row-span-2  bg-gradient bg-cover px-5 pt-8 lg:-mr-5">
        <div className="flex flex-row items-center gap-5 pb-8 text-4xl font-bold text-white">
          <h1>Cписок глав</h1>
          <p>{comics?.chapters?.length}</p>
          <Button
            variant="primary"
            content="icon"
            className="ml-auto -mt-0 h-11 w-11 rounded-2xl bg-white/20"
          >
            <TrendUpBulk />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {comics?.chapters?.map((chapter) => (
            <ChapterCard key={chapter.id} {...chapter} />
          ))}
        </div>
      </aside>

      <section className="col-span-2">
        <h3 className="pb-5 text-2xl font-bold text-white">Похожие</h3>
        <div className="flex flex-col gap-4">
          {Array(5).fill(
            <ComicsCard
              rating={4.6}
              thumbnail={null}
              title={{ title_ru: "Элисед", title_en: "Eliceed" }}
              variant="recomendation"
            ></ComicsCard>
          )}
        </div>
      </section>

      <section className="col-span-6 flex flex-col gap-5 pr-10 text-white">
        <h3 className="text-2xl font-bold text-white">Комментарий</h3>
        <CommentField />
        <Comments />
      </section>
    </>
  );
};

export default Comics;
