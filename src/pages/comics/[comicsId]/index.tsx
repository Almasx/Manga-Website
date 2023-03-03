import { Edit, Eye, Save2, Star1 } from "iconsax-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";

import Badge from "../../../core/ui/primitives/Badge";
import { BookmarkButton } from "components/organisms/BookmarkButton";
import Button from "core/ui/primitives/Button";
import ChapterCard from "../../../components/molecules/ChapterCard";
import ComicsCard from "../../../components/molecules/ComicsCard";
import type { ComicsComment } from "@prisma/client";
import Comment from "../../../components/molecules/Comments";
import CommentField from "../../../components/molecules/CommentField";
import Link from "next/link";
import TrendUpBulk from "../../../../public/icons/TrendUpBulk.svg";
import type { User } from "next-auth";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContextInner } from "../../../server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
  return (
    <>
      <section className="grid grid-cols-8 gap-5 pt-8 lg:col-span-8 ">
        <ComicsCover
          lastChapterId={comics.chapters[0] && comics.chapters[0].id}
          comicsId={comics.id}
          thumbnailId={comics.thumbnail?.id as string}
        />

        <div className="relative flex flex-col gap-5  pr-10 lg:col-span-6">
          <div>
            <h1 className="pb-1 text-4xl font-bold text-light">
              {comics?.title_ru}
            </h1>
            <h3 className="text-2xl font-bold text-light/30">
              {comics?.title}
            </h3>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {comics?.genres?.map((genre) => (
              <Badge key={genre.id}>{genre.title}</Badge>
            ))}
          </div>
          <p className="text-sm text-light">{comics?.description}</p>
          <ComicsStats {...comics} />
          <div className="absolute top-0 right-10 flex items-center gap-2 text-3xl font-bold text-primary">
            {comics?.rating}
            <div className="scale-[1.7]">
              <Star1 />
            </div>
          </div>
        </div>
      </section>

      <ChaptersSection chapters={comics.chapters} />
      <RecomendedList />
      <CommentsSection comicsId={comics.id} initialData={comics.comments} />
    </>
  );
};

interface IComicsCoverProps {
  lastChapterId?: string;
  comicsId: string;
  thumbnailId: string;
}

const ComicsCover = ({
  lastChapterId,
  comicsId,
  thumbnailId,
}: IComicsCoverProps) => {
  const session = useSession();
  const { asPath } = useRouter();

  return (
    <div className="lg:col-span-2">
      <div className="relative flex flex-col gap-5">
        <img
          src={`https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnailId}`}
          alt="lol"
          className="w-full rounded-2xl text-light"
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
          <Link href={`${asPath}/manage`} className="flex">
            <Button className="flex-grow">Загрузка Глав</Button>
          </Link>
        )}
        {session.data?.user?.role !== "ADMIN" && lastChapterId && (
          <div className="relative flex flex-row gap-5">
            <Link
              className="flex grow"
              href={`${asPath}/chapter/${lastChapterId}`}
            >
              <Button className="flex-grow">Начать читать</Button>
            </Link>

            <BookmarkButton comicsId={comicsId} />
          </div>
        )}
      </div>
    </div>
  );
};

interface IComicsStatsProps {
  status: string;
  year: number;
  saved: number;
}

const ComicsStats = ({ status, year, saved }: IComicsStatsProps) => (
  <div className="mt-auto grid grid-cols-4">
    <div>
      <h4 className="text-base font-medium text-light/30">Статус</h4>
      <h3 className="text-lg font-bold text-light">{status}</h3>
    </div>
    <div>
      <h4 className="text-base font-medium text-light/30">Выпуск</h4>
      <h3 className="text-lg font-bold text-light">{year}</h3>
    </div>
    <div>
      <h4 className="text-base font-medium text-light/30">Просмотренно</h4>
      <h3 className="flex items-center gap-2 text-lg font-bold text-light">
        13.4k <Eye size="24" className="text-light/30" />
      </h3>
    </div>
    <div>
      <h4 className="text-base font-medium text-light/30">Сохранённые</h4>
      <h3 className="flex items-center gap-2 text-lg font-bold text-light">
        {saved}
        <Save2 size="24" className="text-light/30" />
      </h3>
    </div>
  </div>
);

const RecomendedList = () => (
  <section className="col-span-2">
    <h3 className="pb-5 text-2xl font-bold text-light">Похожие</h3>
    <div className="flex flex-col gap-4">
      {Array(5).fill(
        <ComicsCard
          rating={4.6}
          thumbnail={{ id: "1", comicsId: "w" }}
          title={{ title_ru: "Элисед", title_en: "Eliceed" }}
          variant="recomendation"
          id={""}
        />
      )}
    </div>
  </section>
);

interface IChapterSectionProps {
  chapters: {
    id: string;
    createdAt: Date;
    chapterIndex: number;
    volumeIndex: number;
  }[];
}

const ChaptersSection = ({ chapters }: IChapterSectionProps) => {
  const { asPath } = useRouter();
  return (
    <aside className="col-span-4 row-span-2 -mt-3 -mr-5 bg-gradient bg-cover px-5 pt-8">
      <div className="flex flex-row items-center gap-5 pb-8 text-4xl font-bold text-light">
        <h1>Cписок глав</h1>
        <p>{chapters?.length}</p>
        <Button
          variant="primary"
          content="icon"
          className="ml-auto -mt-0 h-11 w-11 rounded-2xl bg-light/20"
        >
          <TrendUpBulk />
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {chapters?.map((chapter) => (
          <ChapterCard {...chapter} key={chapter.id} />
        ))}
      </div>
    </aside>
  );
};

interface ICommentsSectionProps {
  comicsId: string;
  initialData: (ComicsComment & {
    author: User;
  })[];
}

const CommentsSection = ({ comicsId, initialData }: ICommentsSectionProps) => {
  const [comment, setComment] = useState<string | undefined>(undefined);
  const { data: comics, refetch } = trpc.comics.getComments.useQuery(
    { comicsId },
    { initialData }
  );

  const { mutate: commentMutate } =
    trpc.comments.postCommentOnComics.useMutation({
      onSuccess: () => refetch(),
    });

  return (
    <section className="col-span-6 flex flex-col gap-5 pr-10 text-light">
      <h3 className="text-2xl font-bold text-light">Комментарий</h3>
      <CommentField
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        onClick={() => comment && commentMutate({ comicsId, content: comment })}
      />
      {comics?.comments?.map((comment) => (
        <Comment key={comment.id} {...comment} rating={10} />
      ))}
    </section>
  );
};

export default Comics;
