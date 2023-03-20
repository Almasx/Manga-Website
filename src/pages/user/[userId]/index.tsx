import DashBoardLayout from "layout/dashboard";
import type { ReactNode } from "react";

const Dashboard = () => {
  return <>loll</>;
};

Dashboard.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default Dashboard;
