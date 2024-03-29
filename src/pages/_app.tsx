import type { AppProps } from "next/app";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import NextNProgress from "nextjs-progressbar";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { Provider } from "jotai";

import KnockWrapper from "lib/knock/KnockWrapper";
import MainLayout from "layout/main";
import { api } from "../utils/api";
import "../styles/globals.css";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, pageProps: any) => ReactNode;
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
  const layout = getLayout(<Component {...pageProps} />, pageProps);

  return (
    <Provider>
      <NextNProgress color="#4A54EB" options={{ showSpinner: false }} />
      <SessionProvider session={session}>
        <KnockWrapper>{layout}</KnockWrapper>
      </SessionProvider>
    </Provider>
  );
};

const TRPCApp = api.withTRPC(MyApp);
export default TRPCApp;
