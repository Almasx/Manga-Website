import { useRouter } from "next/router";
import CommentField from "../../../components/molecules/CommentField";
import Comments from "../../../components/molecules/Comments";
import ChaptersNavigation from "./ChaptersNavigation";
import superjson from "superjson";

import { Eye, Save2, Star1 } from "iconsax-react";
import RecomendedComics from "./RecomendedComics";
import Button from "../../../components/atoms/Button";
import type {
  GetServerSidePropsContext,
  InferGetStaticPropsType,
} from "next/types";

import { ssgHelper, trpc } from "../../../utils/trpc";
import Badge from "../../../components/atoms/Badge";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ comicsId: string }>
) {
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
              {/* <DropDown
              header={
                <Button
                  variant="text"
                  content="icon"
                  className="aspect-square w-10 "
                >
                  <div className="scale-125">
                    <Save />
                  </div>
                </Button>
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
            {/* <h3 className="text-2xl font-bold text-white/33">{comics.title}</h3> */}
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
              <h3 className="text-lg font-bold text-white">
                {/* {comics.year} */}
              </h3>
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
                {/* {comics.saved} */}
                <Save2 size="24" className="text-white/33" />
              </h3>
            </div>
          </div>
          <div className="absolute top-0 right-10 flex items-center gap-2 text-3xl font-bold text-primary">
            {/* {comics.rating} */}
            <div className="scale-[1.7]">
              <Star1 />
            </div>
          </div>
        </div>
      </section>
      {/* <ChaptersNavigation />
        <RecomendedComics /> */}

      <section className="col-span-6 flex flex-col gap-5 pr-10 text-white">
        <h3 className="text-2xl font-bold text-white">Комментарий</h3>
        <CommentField />
        <Comments />
      </section>
    </>
  );
};

export default Comics;
