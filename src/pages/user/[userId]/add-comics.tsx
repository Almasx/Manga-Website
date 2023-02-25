import type { AddComicsSchema } from "lib/schemas/modifyComicsSchema";
import DashBoardLayout from "pages/layout/dashboard";
import ModifyComics from "components/templates/ModifyComics";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { ReactNode } from "react";
import Spinner from "core/ui/primitives/Spinner";
import type { SubmitHandler } from "react-hook-form";
import { trpc } from "utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

const AddComics = () => {
  const comicsMutation = trpc.comics.postComics.useMutation();
  const { mutate: s3Mutate, isLoading: isUploading } = useMutation({
    mutationFn: ({ url, formData }: { url: string; formData: FormData }) => {
      return fetch(url, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      router.push("/catalog");
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<AddComicsSchema> = async (data) => {
    const { url, fields } = (await comicsMutation.mutateAsync(
      data
    )) as PresignedPost;

    const formData = new FormData();
    Object.keys(fields).forEach((name) => {
      formData.append(name, fields[name] as string);
    });

    formData.append("Content-Type", data.thumbnail[0].type);
    formData.append("file", data.thumbnail[0]);

    s3Mutate({ url, formData });
  };

  if (isUploading) {
    return (
      <div className="my-auto">
        <Spinner />
      </div>
    );
  }

  return <ModifyComics onSubmit={onSubmit} />;
};

AddComics.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default AddComics;
