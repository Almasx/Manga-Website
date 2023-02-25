import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import type { EditComicsSchema } from "lib/schemas/modifyComicsSchema";
import ModifyComics from "components/templates/ModifyComics";
import type { SubmitHandler } from "react-hook-form";
import { appRouter } from "server/trpc/router/_app";
import { createContextInner } from "server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

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

const EditComics = ({
  comics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const onSubmit: SubmitHandler<EditComicsSchema> = async (data) => {
    console.log(data);
  };
  return (
    <div className="mx-40 mt-3 w-[80vw]">
      <ModifyComics
        onSubmit={onSubmit}
        defaultValues={{
          ...comics,
          genres: comics?.genres.map((genre) => genre.id),
        }}
      />
    </div>
  );
};

export default EditComics;
