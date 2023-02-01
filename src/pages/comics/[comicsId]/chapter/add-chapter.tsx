import type { ReactNode } from "react";
import AddChapterLayout from "../../../layout/add-chapter";

const AddChapter = () => {
  return <div>AddChapter</div>;
};

AddChapter.getLayout = (page: ReactNode) => (
  <AddChapterLayout>{page}</AddChapterLayout>
);

export default AddChapter;
