import { getServerSession, type DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";
import { type NextAuthOptions } from "next-auth";
import VkProvider from "next-auth/providers/vk";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "env.mjs";
import { prisma } from "server/db";
import { isGroupDon } from "lib/vk/api";
import type { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { knockClient } from "lib/knock/knock-config";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: Role;
      knockId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    knockId?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    role?: Role;
    premium: boolean;
    knockId?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.knockId = user.knockId;
        token.premium = await isGroupDon(account?.access_token as string);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.knockId = token.knockId;
      }

      return session;
    },
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    VkProvider({
      clientId: env.VK_CLIENT_ID,
      clientSecret: env.VK_CLIENT_SECRET,
      authorization: { params: { scope: "groups" } },
    }),
  ],

  events: {
    createUser: async (message) => {
      const bookmarksTitles = [
        "Читаю",
        "В планах",
        "Брошено",
        "Прочитано",
        "Любимые",
      ];

      await prisma.user.update({
        select: { bookmarks: true },
        where: {
          id: message.user.id,
        },
        data: {
          bookmarks: {
            create: bookmarksTitles.map((bookmarkTitle) => ({
              title: bookmarkTitle,
            })),
          },
        },
      });

      knockClient.users
        .identify(message.user.id, {
          ...(message.user.name && { name: message.user.name }),
          avatar: message.user.image,
        })
        .then(async ({ id }) => {
          await prisma.user.update({
            where: { id: message.user.id },
            data: { knockId: id },
          });
        });
    },
  },
};

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getServerSession(ctx.req, ctx.res, authOptions);
};

export const getServerAuthToken = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getToken({ req: ctx.req });
};
