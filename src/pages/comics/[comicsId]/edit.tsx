import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { DenseLayout } from "pages/layout/main";
import type { EditComicsSchema } from "lib/schemas/modifyComicsSchema";
import ModifyComics from "components/templates/ModifyComics";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { ReactNode } from "react";
import Spinner from "core/ui/primitives/Spinner";
import type { SubmitHandler } from "react-hook-form";
import { appRouter } from "server/trpc/router/_app";
import { createContextInner } from "server/trpc/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getDifferenceObject } from "utils/get-difference-object";
import router from "next/router";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useMutation } from "@tanstack/react-query";

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
  const comicsMutation = trpc.comics.putComics.useMutation();
  const { mutateAsync: s3Mutate, isLoading: isUploading } = useMutation({
    mutationFn: ({ url, formData }: { url: string; formData: FormData }) => {
      return fetch(url, {
        method: "POST",
        body: formData,
      });
    },
  });

  const onSubmit: SubmitHandler<EditComicsSchema> = async (data) => {
    const initialData = {
      ...comics,
      genres: comics?.genres.map((genre) => genre.id),
    };
    const modifiedData = (({ genresQuery, ...data }) => data)(data);
    const putData = getDifferenceObject(initialData, modifiedData);

    console.log(putData);
    const { url, fields } = (await comicsMutation.mutateAsync({
      ...putData,
      id: comics.id,
    })) as PresignedPost;

    if (putData.thumbnail) {
      const formData = new FormData();
      Object.keys(fields).forEach((name) => {
        formData.append(name, fields[name] as string);
      });

      formData.append("Content-Type", data.thumbnail[0].type);
      formData.append("file", data.thumbnail[0]);

      await s3Mutate({ url, formData });
    }
    router.push(`/comics/${comics.id}`);
  };

  if (isUploading || comicsMutation.isLoading) {
    return (
      <div className="px-auto my-auto w-[80vw]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="col-span-full mt-3">
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

EditComics.getLayout = (page: ReactNode) => <DenseLayout>{page}</DenseLayout>;

export default EditComics;
