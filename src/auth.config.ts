import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthRoute = nextUrl.pathname.startsWith('/login') ||
                nextUrl.pathname.startsWith('/auth') ||
                nextUrl.pathname.startsWith('/request-account');

            if (nextUrl.pathname === '/') {
                return true;
            }

            if (!isLoggedIn && !isAuthRoute) {
                return false; // Redirect to signIn page
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
