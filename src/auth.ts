import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [GitHub, Google],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      //if (pathname === "/middleware-example") return !!auth
      if (!auth) {
        //return NextResponse.json("Invalid auth token", { status: 401 })
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
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
