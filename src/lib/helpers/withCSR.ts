import type { GetServerSidePropsContext } from "next";

export const withCSR =
  (next) =>
  async <T extends GetServerSidePropsContext>(ctx: T) => {
    // check is it a client side navigation
    const isCSR = ctx.req.url?.startsWith("/_next");

    if (isCSR) {
      return {
        props: {},
      };
    }

    return next?.(ctx);
  };
