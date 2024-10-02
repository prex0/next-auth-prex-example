import NextAuth from "next-auth"
import "next-auth/jwt"
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"
import type { NextAuthConfig } from "next-auth"
import { PrexBackendApi } from "./lib/prex-api"

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

const storageAdaptor = UnstorageAdapter(storage)

const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: storageAdaptor,
  providers: [
    Resend({
      from: process.env.EMAIL_FROM
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const prexApi = new PrexBackendApi(process.env.NEXT_PUBLIC_POLICY_ID ?? "")

        const result = await prexApi.verify(credentials.password as string)

        if (!result.verified) {
          return null;
        }

        if(!storageAdaptor.getUser) {
          return null
        }

        const user = await storageAdaptor.getUser(result.wallet.sub)

        return user
      }
    }),
  ],
  basePath: "/api/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.userId = token.sub ?? "";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

declare module "next-auth" {
  interface Session {
    accessToken?: string
    userId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
