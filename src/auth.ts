import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [GitHub, Google],
  callbacks: {
    authorized({ request, auth }) {
      if (!auth) {
        //return NextResponse.json("Invalid auth token", { status: 401 });
        return NextResponse.redirect(new URL("/", request.url));
      }
      return true;
    },
    /*
    //  This code allow auth() to expose jwt.sub and accessToken (can be used to identify user).
    //  But I decided to use email address instead.
    //  One possible drawback is that: if Github account and Google account have the same email address,
    //  2 account will be connected to the same user.
    //  Could be a good thing, could be a bad thing.
    //
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    },
    */
    async redirect({ baseUrl }) {
      // redirect to /home after sign in or sign out (in sign out case, will be further redirect to welcome page by middleware)
      return `${baseUrl}/home`;
    },

    async jwt({ token, account, profile }) {
      // The first time this jwt callback is called (at sign in), all parameters (token, account, profile) will exist.
      // After that, only the "token" parameter will be passed to this function.

      // When user sign in, update the User table in the database (findOrCreate user)

      //TODO: Disable this feature in development to avoid Prisma client connect to DB after server reload

      try {
        if (account || profile) {
          const findUser = await prisma.user.findFirst({
            where: {
              email: {
                some: {
                  email: {
                    equals: token.email as string,
                  },
                },
              },
            },
          });

          if (!findUser) {
            await prisma.user.create({
              data: {
                email: {
                  create: {
                    email: token.email as string,
                  },
                },
              },
              include: {
                email: true,
              },
            });
          }
        }
      } catch (e) {
        throw new Error(
          "(while auth)Something failed, network maybe? Cannot connect to DB? Please try again",
        );
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
