import "@knocklabs/react-notification-feed/dist/index.css";

import { KnockFeedProvider } from "@knocklabs/react-notification-feed";
import type { ReactNode } from "react";
import { env } from "env.mjs";
import { useSession } from "next-auth/react";

const KnockWrapper = ({ children }: { children: ReactNode }) => {
  const { data } = useSession();

  if (data?.user?.knockId) {
    return (
      <KnockFeedProvider
        colorMode="dark"
        apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
        feedId={env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}
        userId={data?.user?.knockId}
      >
        <>{children}</>
      </KnockFeedProvider>
    );
  }
  return <>{children}</>;
};

export default KnockWrapper;
