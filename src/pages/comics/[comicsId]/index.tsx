import { Edit, Eye, Save2, Star1 } from "iconsax-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";

import Badge from "../../../core/ui/primitives/Badge";
import Button from "core/ui/primitives/Button";
import ChapterCard from "../../../components/molecules/ChapterCard";
import ComicsCard from "../../../components/molecules/ComicsCard";
import CommentField from "../../../components/molecules/CommentField";
import Comments from "../../../components/molecules/Comments";
import DropDown from "core/ui/primitives/DropDown";
import Link from "next/link";
import Tab from "core/ui/templates/SideBar/Section/Tab";
import TrendUpBulk from "../../../../public/icons/TrendUpBulk.svg";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContextInner } from "../../../server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ comicsId: string }>
) => {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: createContextInner({ session: null }),
    transformer: superjson,
  });

  const comicsId = context.params?.comicsId as string;

  try {
    const comics = await ssgHelper.comics.getComics.fetch({ comicsId });
    return {
      props: {
        trpcState: ssgHelper.dehydrate(),
        comics,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

const Comics = ({
  comics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const { asPath } = useRouter();
  const { data: user } = trpc.auth.getBookmarks.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <>
      <section className="grid grid-cols-8 gap-5 pt-8 lg:col-span-8 ">
        <div className="lg:col-span-2">
          <div className="relative flex flex-col gap-5">
            <img
              src={`https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${comics?.thumbnail?.id}`}
              alt="lol"
              className="w-full rounded-2xl text-white"
            />
            {session.data?.user?.role === "ADMIN" && (
              <Link
                href={`${asPath}/edit`}
                className="absolute top-0 right-0 flex "
              >
                <Button className="flex-grow rounded-tl-none rounded-br-none bg-primary/80 px-3 py-3 backdrop-blur-2xl">
                  <Edit size="20" />
                </Button>
              </Link>
            )}

            {session.data?.user?.role === "ADMIN" && (
              <Link
                href={{
                  pathname: `${asPath}/chapter/add-chapter`,
                  query: {
                    title: comics?.title,
                    title_ru: comics?.title_ru,
                    chapters: encodeURIComponent(
                      JSON.stringify(comics?.chapters)
                    ),
                    thumbnail:
                      `https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${comics?.thumbnail?.id}` ??
                      "",
                  },
                }}
                className="flex"
              >
                <Button className="flex-grow">Добавить Главу</Button>
              </Link>
            )}
            {session.data?.user?.role !== "ADMIN" &&
              comics?.chapters &&
              comics.chapters.length > 0 && (
                <div className="relative flex flex-row gap-5">
                  <Link
                    className="flex grow"
                    href={{
                      pathname: `${asPath}/chapter/${comics?.chapters[0]}`,
                      query: {
                        chapters: encodeURIComponent(
                          JSON.stringify(comics?.chapters[0])
                        ),
                      },
                    }}
                  >
                    <Button className="flex-grow">Начать читать</Button>
                  </Link>

                  {session.data?.user?.role === "USER" && user?.bookmarks && (
                    <DropDown
                      header={
                        <Button
                          variant="text"
                          content="icon"
                          className="aspect-square w-10 "
                        >
                          <div className="scale-125">
                            <Save2 />
                          </div>
                        </Button>
                      }
                      options={user.bookmarks.map((bookmark) => (
                        <Tab
                          active={false}
                          key={bookmark.id}
                          // onClick={() => onBookmark(bookmark.id)}
                        >
                          {bookmark.title}
                        </Tab>
                      ))}
                    />
                  )}
                </div>
              )}
          </div>
        </div>

        <div className="relative flex flex-col gap-5  pr-10 lg:col-span-6">
          <div className="">
            <h1 className="pb-1 text-4xl font-bold text-white">
              {comics?.title_ru}
            </h1>
            <h3 className="text-2xl font-bold text-white/30">
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
              <h4 className="text-base font-medium text-white/30">Статус</h4>
              <h3 className="text-lg font-bold text-white">{comics?.status}</h3>
            </div>
            <div>
              <h4 className="text-base font-medium text-white/30">Выпуск</h4>
              <h3 className="text-lg font-bold text-white">{comics?.year}</h3>
            </div>
            <div>
              <h4 className="text-base font-medium text-white/30">
                Просмотренно
              </h4>
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                13.4k <Eye size="24" className="text-white/30" />
              </h3>
            </div>
            <div>
              <h4 className="text-base font-medium text-white/30">
                Сохранённые
              </h4>
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                {comics?.saved}
                <Save2 size="24" className="text-white/30" />
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

      <aside className="col-span-4 row-span-2 -mt-3 -mr-5 bg-gradient bg-cover px-5 pt-8">
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
            <Link
              className="flex"
              href={{
                pathname: `${asPath}/chapter/${chapter.id}`,
              }}
              key={chapter.id}
            >
              <ChapterCard {...chapter} />
            </Link>
          ))}
        </div>
      </aside>

      <RecomendedList />

      <section className="col-span-6 flex flex-col gap-5 pr-10 text-white">
        <h3 className="text-2xl font-bold text-white">Комментарий</h3>
        <CommentField />
        <Comments />
      </section>
    </>
  );
};

const RecomendedList = () => (
  <section className="col-span-2">
    <h3 className="pb-5 text-2xl font-bold text-white">Похожие</h3>
    <div className="flex flex-col gap-4">
      {Array(5).fill(
        <ComicsCard
          rating={4.6}
          thumbnail={null}
          title={{ title_ru: "Элисед", title_en: "Eliceed" }}
          variant="recomendation"
        />
      )}
    </div>
  </section>
);

export default Comics;
