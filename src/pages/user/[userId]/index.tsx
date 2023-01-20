import type { ReactNode } from "react";
import DashBoardLayout from "../../layout/dashboard";

const Dashboard = () => {
  return <>loll</>;
};

Dashboard.getLayout = (page: ReactNode) => (
  <DashBoardLayout>{page}</DashBoardLayout>
);

export default Dashboard;
