import type { AppProps } from "next/app";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import MainLayout from "./layout/main";
import { Provider } from "jotai";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <Provider>
      <SessionProvider session={session}>{layout}</SessionProvider>
    </Provider>
  );
};

const TRPCApp = trpc.withTRPC(MyApp);
export default TRPCApp;
