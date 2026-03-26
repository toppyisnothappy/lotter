import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Protected by default: all routes except static assets and Next internals
    matcher: ['/((?!_next/static|_next/image|favicon.ico/).*)'],
}
