import type { NextAuthConfig } from "next-auth"
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES } from "./lib/routes";

export default {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
 const { pathname } = nextUrl;
    const isLoggedIn = !!auth?.user;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // 1. If user login and try access login/register
    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return true;
    }

    // 2. If user not login and try access private routes
    if (!isLoggedIn && !isPublicRoute) {
      return false; // Automatically redirect to login by NextAuth
    }

    // 3. (Optional) Role-based access control
    // if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    //   return Response.redirect(new URL('/unauthorized', nextUrl));
    // }

    return true;
    },
  },
} satisfies NextAuthConfig
