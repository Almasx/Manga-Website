import Button from "core/ui/primitives/Button";
import ComicsCard from "components/molecules/ComicsCard";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import clsx from "clsx";
import { prisma } from "server/db";
import useScreen from "lib/hooks/useScreen";

export async function getStaticProps() {
  const catalog = await prisma.comics.findMany({
    select: {
      thumbnail: true,
      title: true,
      title_ru: true,
      id: true,
      ratings: true,
      external_thumbnail: true,
    },
    orderBy: {
      bookmarks: { _count: "desc" },
    },
    take: 12,
  });
  return { props: { catalog } };
}

const Home = ({ catalog }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isPhone, isSmallDevice } = useScreen();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute inset-x-0 top-0 h-screen overflow-clip md:left-[55vw]">
        {isSmallDevice && (
          <div
            className="absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(180deg, #020202 0%, rgba(2, 2, 2, 0.783333) 27.4%, rgba(0, 0, 0, 0.5) 56.56%, rgba(2, 2, 2, 0.851319) 71.67%, #020202 100%);",
            }}
          />
        )}
        <div className="xl:[40vw] relative -left-10 grid h-screen w-[120vw] rotate-12 grid-cols-3 gap-4 md:left-20 md:w-[50vw] xl:-top-24 xl:scale-75">
          {catalog.map((comics, index) => {
            return (index + 1) % 3 === 2 ? (
              <div className={"relative -top-24"} key={comics.id}>
                <ComicsCard
                  id={comics.id}
                  title={{ title_en: comics.title, title_ru: comics.title_ru }}
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  {...(comics.thumbnail
                    ? { thumbnail: comics.thumbnail }
                    : { external_link: comics.external_thumbnail as string })}
                  rating={comics.ratings.length}
                />
              </div>
            ) : (
              <ComicsCard
                id={comics.id}
                title={{ title_en: comics.title, title_ru: comics.title_ru }}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                {...(comics.thumbnail
                  ? { thumbnail: comics.thumbnail }
                  : { external_link: comics.external_thumbnail as string })}
                rating={comics.ratings.length}
              />
            );
          })}
        </div>
      </div>
      <section className=" relative z-30 col-span-full flex h-[calc(100vh-64px)] flex-col justify-center sm:col-span-6">
        <h1 className="mb-3 text-4xl font-semibold ">
          Metamanga{" "}
          {!isPhone && (
            <span className="inline-block h-9 w-24 translate-y-[6px] rounded-full bg-gradient bg-contain" />
          )}{" "}
          оживление вашей любимой манги на русском языке
        </h1>
        <p className="mb-12 text-base leading-relaxed text-light/80">
          Откройте для себя, читайте и делитесь любимой мангой на русском языке
          с помощью нашей универсальной платформы, созданной для
          непревзойденного пользовательского опыта.
        </p>
        <div className="mb-3 flex gap-3">
          <Button className="px-4">Начать Читать</Button>
          <Button variant="secondary" className="px-4">
            Оформить подписку
          </Button>
        </div>
        <p className="font-semibold italic text-[#969696]">
          Более чем 25 000+ пользователей предпочли Metamanga
        </p>
      </section>
      <section className="relative z-30 col-span-full grid grid-cols-1 gap-8 pb-52 sm:grid-cols-2 lg:bg-dark">
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold italic">
            Максимальное удобство
          </h3>
          <p className="mb-3 text-light/80">
            Платформа "все в одном", созданная для беспрепятственного чтения
            манги
          </p>
          <div className="text-sm text-[#969696]">
            Больше никаких низкокачественных телеграм-каналов или запутанной
            навигации. С Metamanga вы будете наслаждаться удобной платформой,
            которая предлагает персонализированные уведомления, предложения
            названий и интерактивное сообщество, и все это в одном месте.
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold italic">
            Качественные переводы
          </h3>
          <p className="mb-3 text-light/80">
            Наслаждайтесь мангой как никогда раньше благодаря высококачественным
            русским переводам.
          </p>
          <div className="text-sm text-[#969696]">
            Не соглашайтесь на меньшее. Наша команда переводчиков гарантирует,
            что каждая глава манги, которую вы читаете, будет точной,
            увлекательной и верной оригинальной истории. Погрузитесь в любимую
            мангу без языкового барьера.
          </div>
        </div>
      </section>
      <section className="col-span-full"></section>
    </>
  );
};

export default Home;
