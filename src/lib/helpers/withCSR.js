// import type { GetServerSidePropsContext } from "next";
// <T extends GetServerSidePropsContext>
export const withCSR = (next) => async (ctx) => {
  // check is it a client side navigation
  const isCSR = ctx.req.url?.startsWith("/_next");

  if (isCSR) {
    return {
      props: {},
    };
  }

  return next?.(ctx);
};
