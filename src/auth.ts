import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/shared/lib/db"
import { accounts, sessions, users, verificationTokens, profiles } from "@/shared/lib/db/schema"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const [userWithProfile] = await db
                    .select({
                        id: users.id,
                        email: users.email,
                        name: users.name,
                        password: users.password,
                        role: profiles.role,
                        organizationId: profiles.organizationId,
                    })
                    .from(users)
                    .leftJoin(profiles, eq(users.id, profiles.id))
                    .where(eq(users.email, credentials.email as string))
                    .limit(1);

                if (!userWithProfile || !userWithProfile.password) return null;

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    userWithProfile.password
                );

                if (!isPasswordValid) return null;

                return {
                    id: userWithProfile.id,
                    email: userWithProfile.email,
                    name: userWithProfile.name,
                    role: userWithProfile.role,
                    organizationId: userWithProfile.organizationId,
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.organizationId = (user as any).organizationId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
                (session.user as any).organizationId = token.organizationId;
            }
            return session;
        },
    },
})
