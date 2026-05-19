import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;
        if (email !== process.env.ADMIN_EMAIL) return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) return null;

        const match = await bcrypt.compare(password, hash);
        if (!match) return null;

        return { id: "1", name: "Admin", email };
      },
    }),
  ],
});
