import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const user = auth?.user as any;
            const role = user?.role;
            const slug = user?.slug;
            const pathname = nextUrl.pathname;

            const isAuthRoute = pathname.startsWith('/login') ||
                pathname.startsWith('/api/auth') ||
                pathname.startsWith('/request-account');

            const isPublicRoute = pathname === '/' || isAuthRoute;

            // 1. Mandatory Login Check
            if (!isLoggedIn) {
                if (isPublicRoute) return true;
                return false; // Redirect to login
            }

            // 2. Role-Based Access Control (RBAC) & Dynamic Redirects

            // Redirect from generic routes to appropriate dashboard
            const isGenericPath = pathname === '/' || pathname === '/login' || pathname === '/dashboard';

            if (isGenericPath) {
                if (role === 'super_admin') {
                    return Response.redirect(new URL('/admin', nextUrl));
                } else if (slug) {
                    return Response.redirect(new URL(`/${slug}/dashboard`, nextUrl));
                }
            }

            // Restrict non-admins from /admin
            if (role !== 'super_admin') {
                if (pathname.startsWith('/admin')) {
                    // Redirect to their own dashboard instead of root if possible
                    if (slug) {
                        return Response.redirect(new URL(`/${slug}/dashboard`, nextUrl));
                    }
                    return Response.redirect(new URL('/', nextUrl));
                }
            }

            // Standard fallback: Allow authenticated users
            return true;
        },
    },
} satisfies NextAuthConfig;
