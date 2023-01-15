import { useRouter } from "next/router";
import type { ReactNode } from "react";
import DashBoardLayout from "../../../layout/dashboard";

const Dashboard = () => {
  const { query } = useRouter();
  const { userId } = query;

  return <>loll</>;
};

Dashboard.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default Dashboard;
