import NextAuth, { type NextAuthOptions } from "next-auth";
import VkProvider from "next-auth/providers/vk";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import bcrypt from "bcryptjs";

import { env } from "../../../env/server.mjs";
import prisma from "../../../server/db/client";
import { isGroupDon } from "../../../lib/vk/isDon";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      console.log(isGroupDon(account?.access_token as string));
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
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
    },
  },
};

export default NextAuth(authOptions);
