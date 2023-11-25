import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google"

import type { NextAuthConfig } from "next-auth";

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    GitHub,
    Google,
  ],
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
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
