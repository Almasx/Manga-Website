import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import VkProvider from "next-auth/providers/vk";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import bcrypt from "bcryptjs";

import { env } from "../../../env/server.mjs";
import prisma from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
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
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    VkProvider({
      clientId: env.VK_CLIENT_ID,
      clientSecret: env.VK_CLIENT_SECRET,
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
          email: message.user.email!,
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
