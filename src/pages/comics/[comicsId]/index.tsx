import ChapterCard, {
  ChapterCardLoading,
} from "../../../components/molecules/ChapterCard";
import ComicsCard, {
  ComicsCardLoading,
} from "../../../components/molecules/ComicsCard";
import { Edit, Like1, Save2, Star1 } from "iconsax-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";

import Badge from "../../../core/ui/primitives/Badge";
import { BookmarkButton } from "components/organisms/BookmarkButton";
import Button from "core/ui/primitives/Button";
import type { ComicsComment } from "@prisma/client";
import ComicsLayout from "layout/comics";
import Comment from "../../../components/molecules/Comment";
import CommentField from "../../../components/molecules/CommentField";
import type { IModal } from "types/model";
import type { IThumbnail } from "../../../components/molecules/ComicsCard";
import Link from "next/link";
import Modal from "core/ui/primitives/Modal";
import type { ReactNode } from "react";
import type { RouterOutputs } from "utils/api";
import Star from "../../../../public/icons/Star.svg";
import Star3 from "../../../../public/icons/Star3.svg";
import { TabBar } from "core/ui/primitives/TabBar";
import TrendUp from "../../../../public/icons/TrendUp.svg";
import TrendUpBulk from "../../../../public/icons/TrendUpBulk.svg";
import type { User } from "next-auth";
import { api } from "utils/api";
import { appRouter } from "server/api/root";
import clsx from "clsx";
import { createInnerTRPCContext } from "server/api/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "server/auth";
import { numberFormatter } from "utils/formaters";
import superjson from "superjson";
import { useRouter } from "next/router";
import useScreen from "lib/hooks/useScreen";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ comicsId: string }>
) => {
  const session = await getServerAuthSession(context);
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
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
  const { isSmallDevice, isPhone, isLaptop } = useScreen();

  const [showRating, setShowRating] = useState<boolean>(false);
  const [tab, setTab] = useState<"chapters" | "comments">("chapters");

  return (
    <div className="relative col-span-full flex flex-col gap-5 pb-16 sm:pb-0 md:grid md:grid-cols-8 lg:pr-[404px] xl:pr-[500px]">
      {isSmallDevice && (
        <div className="-mb-5 flex h-3 items-center justify-center">
          <div className=" h-[5.5px] w-[35vw] rounded-full bg-gray-dark-secondary" />
        </div>
      )}

      <ComicsCover
        lastChapterId={comics.chapters[0] && comics.chapters[0].id}
        comicsId={comics.id}
        {...(comics.thumbnail
          ? { thumbnail: comics.thumbnail }
          : { external_link: comics.external_thumbnail as string })}
      />

      <div className="relative flex flex-col gap-5 md:col-span-6 md:pt-8">
        <article>
          <h1 className="flex items-center gap-3 pb-1 text-4xl font-bold text-light">
            {comics?.title_ru}
            {session.data?.user?.role === "ADMIN" && !isPhone && (
              <Link href={`${asPath}/edit`}>
                <Button
                  className="!px-2 !py-1 text-base backdrop-blur-2xl"
                  variant="secondary"
                >
                  <div className="flex flex-row items-center gap-2 font-normal">
                    Отредактировать <Edit size="20" />
                  </div>
                </Button>
              </Link>
            )}
          </h1>
          <h3 className="text-2xl font-bold text-light/30">{comics?.title}</h3>
        </article>

        <p className="text-sm text-light">{comics?.description}</p>

        {comics?.genres.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2">
            {comics?.genres?.map((genre) => (
              <Badge key={genre.id}>{genre.title}</Badge>
            ))}
          </div>
        )}

        <ComicsStats {...comics} />
        <div className="absolute right-0 flex items-center gap-2 text-3xl font-bold text-primary md:top-8 ">
          {comics?.ratings.toFixed(1)}
          <Star />
          {session?.status === "authenticated" && (
            <Button
              variant="secondary"
              className="!absolute right-1/2 bottom-[9px] h-3 translate-y-full translate-x-1/2 rounded-full
                           bg-dark/60 px-1 text-xs font-normal backdrop-blur-md"
              onClick={() => setShowRating(true)}
            >
              Оценить
            </Button>
          )}
        </div>
      </div>

      <RecommendedList genres={comics.genres.map((genre) => genre.id)} />

      {(isSmallDevice || isLaptop) && (
        <div className="col-span-full -mt-5">
          <TabBar
            packed={false}
            onChange={(value: "chapters" | "comments") => {
              setTab(value);
            }}
            tabs={[
              { label: "Главы", value: "chapters" },
              { label: "Комментарий", value: "comments" },
            ]}
          />
        </div>
      )}

      <ChaptersSection
        chapters={comics.chapters}
        comicsId={comics.id}
        show={isSmallDevice || isLaptop ? tab === "chapters" : true}
      />
      <CommentsSection
        comicsId={comics.id}
        initialData={comics.comments as any}
        show={isSmallDevice || isLaptop ? tab === "comments" : true}
      />

      <RatingModal
        title={comics.title}
        visible={showRating}
        setVisible={setShowRating as any}
        comicsId={comics.id}
      />
    </div>
  );
};

type IComicsCoverProps = {
  lastChapterId?: string;
  comicsId: string;
} & IThumbnail;

const ComicsCover = ({
  lastChapterId,
  comicsId,
  external_link,
  thumbnail,
}: IComicsCoverProps) => {
  const session = useSession();
  const { asPath } = useRouter();
  const { isSmallDevice } = useScreen();

  return (
    <div className="md:col-span-2 md:pt-8">
      <div className="flex flex-col md:gap-5">
        {!isSmallDevice && (
          <img
            src={
              external_link ??
              `https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnail?.id}`
            }
            alt="lol"
            className="aspect-[3/4] w-full rounded-2xl text-light"
          />
        )}
        <div className="overlay-gradient fixed inset-x-0 bottom-0 z-10 grow p-4 pt-8 md:relative md:p-0">
          {session.data?.user?.role === "ADMIN" && (
            <Link href={`${asPath}/manage`} className="flex">
              <div className="flex grow items-center justify-center rounded-xl bg-primary py-2  font-bold">
                Загрузка Глав
              </div>
            </Link>
          )}
          {session.data?.user?.role !== "ADMIN" && lastChapterId && (
            <div className="flex flex-row gap-3">
              <Link
                className="flex grow"
                href={`${asPath}/chapter/${lastChapterId}`}
              >
                <div className="flex grow items-center justify-center rounded-xl bg-primary py-2  font-bold">
                  Начать читать
                </div>
              </Link>

              <BookmarkButton comicsId={comicsId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface IComicsStatsProps {
  status: string;
  year: number;
  saved: number;
  ratingLength: number;
}

const ComicsStats = ({
  status,
  year,
  saved,
  ratingLength,
}: IComicsStatsProps) => (
  <div className="mt-auto flex flex-row gap-2  sm:grid sm:grid-cols-4 sm:gap-0 ">
    <div className="flex grow sm:block">
      <h4 className="hidden text-base font-medium text-light/30 sm:block">
        Статус
      </h4>
      <h3 className="flex grow justify-center rounded-xl bg-dark-tertiary py-1 text-lg font-bold text-light sm:justify-start sm:bg-transparent sm:p-0">
        {status}
      </h3>
    </div>
    <div className="flex grow sm:block">
      <h4 className="hidden text-base font-medium text-light/30 sm:block ">
        Выпуск
      </h4>
      <h3 className=" flex grow justify-center rounded-xl bg-dark-tertiary py-1 text-lg font-bold text-light sm:justify-start sm:bg-transparent sm:p-0">
        {year}
      </h3>
    </div>
    <div className="flex grow sm:block">
      <h4 className="hidden text-base font-medium text-light/30 sm:block ">
        Оценки
      </h4>
      <h3 className=" flex grow items-center justify-center gap-2 rounded-xl bg-dark-tertiary py-1 text-lg font-bold text-light sm:justify-start sm:bg-transparent sm:p-0">
        {numberFormatter.format(ratingLength)}
        <Like1 size="24" className="text-light/30 " />
      </h3>
    </div>
    <div className="flex grow sm:block">
      <h4 className="hidden text-base font-medium text-light/30 sm:block ">
        Сохранённые
      </h4>
      <h3 className=" flex grow items-center justify-center gap-2 rounded-xl bg-dark-tertiary py-1 text-lg font-bold text-light sm:justify-start sm:bg-transparent sm:p-0">
        {numberFormatter.format(saved)}
        <Save2 size="24" className="text-light/30 " />
      </h3>
    </div>
  </div>
);

const RatingModal = ({
  title,
  comicsId,
  setVisible,
  visible,
}: { title: string; comicsId: string } & IModal) => {
  const [hover, setHover] = useState(0);
  const { data } = api.rating.getRating.useQuery({ comicsId });

  const { mutate: ratingMutate } = api.rating.postRating.useMutation({
    onSuccess: () => setVisible(false),
  });

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <div className="relative flex w-96 flex-col items-center gap-2 px-8 py-6">
        <div className="absolute -top-0 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-primary px-3 py-2 text-xs font-bold text-light">
          Рейтинг
        </div>

        <div className="flex gap-5 py-4">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                key={index}
                className=" text-primary"
                onClick={() => ratingMutate({ rating: index, comicsId })}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(data?.rating || 0)}
              >
                {index <= (hover || data?.rating || 0) ? (
                  <Star3 />
                ) : (
                  <Star1 size="40" />
                )}
              </button>
            );
          })}
        </div>
        <h2 className=" w-full text-center text-sm text-light/30">
          Мы будем рады услышать ваше мнение об {title}. Ваш отзыв поможет нам
          улучшить рейтинговую систему
        </h2>
      </div>
    </Modal>
  );
};

const RecommendedList = ({ genres }: { genres: string[] }) => {
  const { data: recommendation, isLoading } =
    api.comics.getRecommendedComics.useQuery({
      genres,
    });

  return (
    <section className="col-span-full lg:col-span-2 lg:col-start-1">
      <h3 className="pb-2 text-xl font-bold text-light md:pb-3 md:text-2xl lg:pb-5">
        Похожие
      </h3>
      <div className="scrollbar-hide flex flex-row gap-4 overflow-x-auto lg:flex-col ">
        {isLoading
          ? Array(5).fill(<ComicsCardLoading variant="recomendation" />)
          : recommendation!.map((comics) => (
              <ComicsCard
                variant="recomendation"
                id={comics.id}
                key={comics.id}
                title={{ title_en: comics.title, title_ru: comics.title_ru }}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                thumbnail={comics.thumbnail!}
                rating={comics.ratings.length}
              />
            ))}
      </div>
    </section>
  );
};

interface IChapterSectionProps {
  comicsId: string;
  chapters: RouterOutputs["comics"]["getComics"]["chapters"];
  show?: boolean;
}

const ChaptersSection = ({
  chapters,
  comicsId,
  show = true,
}: IChapterSectionProps) => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data } = api.comics.getChapters.useQuery(
    { order, comicsId },
    { initialData: chapters, refetchOnWindowFocus: true, refetchOnMount: true }
  );
  const { isSmallDevice, isLaptop } = useScreen();

  if (!show) {
    return <></>;
  }

  return (
    <aside
      className="relative col-span-full flex flex-col bg-cover lg:fixed lg:inset-y-0 
                 lg:right-0 lg:-mr-5 lg:h-screen lg:w-[384px] lg:bg-gradient lg:px-5 lg:pt-24 xl:w-[480px]"
    >
      {!isSmallDevice && (
        <div className="flex flex-row items-center gap-3 pb-5 text-2xl font-bold text-light lg:gap-5 lg:pb-8 lg:text-4xl">
          <h1>Cписок глав</h1>
          <p>{data?.chapters?.length}</p>

          <Button
            variant={isSmallDevice || isLaptop ? "secondary" : "primary"}
            content="icon"
            className="ml-auto -mt-0 h-9 w-9 rounded-2xl bg-light/20 lg:h-11 lg:w-11"
            onClick={() =>
              setOrder((previos) => (previos === "asc" ? "desc" : "asc"))
            }
          >
            <div className={clsx(order === "desc" && "-scale-y-100")}>
              {isSmallDevice || isLaptop ? (
                <TrendUp className="block text-primary" />
              ) : (
                <TrendUpBulk />
              )}
            </div>
          </Button>
        </div>
      )}
      {!data?.chapters ? (
        <div className="no-scroll scrollbar-hide flex grow flex-col gap-4 overflow-y-auto rounded-xl lg:-ml-14 lg:pl-4 lg:pr-3">
          {Array(8).fill(<ChapterCardLoading />)}
          <div className="lg:h-8" />
        </div>
      ) : chapters?.length > 0 ? (
        <div className="no-scroll scrollbar-hide flex grow flex-col gap-4 overflow-y-auto rounded-xl lg:-ml-14 lg:pl-4 lg:pr-3">
          {data?.chapters?.map((chapter) => (
            <ChapterCard
              read={
                chapters.find(
                  (initialChapter) => initialChapter.id === chapter.id
                )?.read || false
              }
              {...chapter}
              key={chapter.id}
            />
          ))}

          <div className="lg:h-8" />
        </div>
      ) : (
        <div className="absolute inset-0 z-10 grid place-items-center backdrop-blur-md">
          <div className="mx-12 rounded-xl bg-dark/40 p-3">
            Упс! Похоже, еще нет загруженных глав. Зайдите позже, чтобы увидеть,
            есть ли какие-либо новые обновления. Мы уверены, что скоро здесь
            будет интересные главы.
          </div>
        </div>
      )}
    </aside>
  );
};

interface ICommentsSectionProps {
  comicsId: string;
  initialData: (ComicsComment & {
    author: User;
  })[];
  show?: boolean;
}

const CommentsSection = ({
  comicsId,
  initialData,
  show = false,
}: ICommentsSectionProps) => {
  const [comment, setComment] = useState<string | undefined>(undefined);
  const { data: comics, refetch } = api.comics.getComments.useQuery(
    { comicsId },
    { initialData }
  );
  const { isSmallDevice } = useScreen();

  const { mutate: commentMutate } = api.comics.postComment.useMutation({
    onSuccess: () => refetch(),
  });

  if (!show) {
    return <></>;
  }

  return (
    <section className="col-span-full flex flex-col gap-5 pb-5 text-light lg:col-span-6">
      {!isSmallDevice && (
        <h3 className="text-2xl font-bold text-light">Комментарий</h3>
      )}
      <CommentField
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        onClick={() => comment && commentMutate({ comicsId, content: comment })}
      />
      {comics?.comments?.map((comment) => {
        return (
          <Comment
            type="comics"
            key={comment.id}
            {...comment}
            initialRating={comment.upVote - comment.downVote}
          />
        );
      })}
    </section>
  );
};

Comics.getLayout = (
  page: ReactNode,
  { comics }: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <ComicsLayout thumbnailId={comics.thumbnail?.id as string}>
    {page}
  </ComicsLayout>
);

export default Comics;
