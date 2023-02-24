import DashBoardLayout from "pages/layout/dashboard";
import ModifyComics from "components/templates/ModifyComics";
import type { ReactNode } from "react";

const AddComics = () => {
  return <ModifyComics />;
};

AddComics.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default AddComics;
