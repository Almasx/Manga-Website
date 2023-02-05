import FileField from "components/ui/fields/FileField";
import type { ReactNode } from "react";
import AddChapterLayout from "../../../layout/add-chapter";

const AddChapter = () => {
  return (
    <>
      <h3 className=" mb-5 text-xl font-medium text-white/40">Страницы</h3>

      <FileField
        className="h-48 justify-center"
        watchThumbnail={undefined}
        showPreview={false}
        // error={errors.thumbnail?.message as string}
        // {...register("thumbnail", { required: true })}
      />
    </>
  );
};

AddChapter.getLayout = (page: ReactNode) => (
  <AddChapterLayout>{page}</AddChapterLayout>
);

export default AddChapter;
