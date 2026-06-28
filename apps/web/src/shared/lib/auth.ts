import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// API_INTERNAL_URL is for server-side calls inside Docker (http://api:3001).
// Falls back to NEXT_PUBLIC_API_URL for local dev.
const API_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// Backend JWT is 15 min; refresh 1 min early to avoid edge-case expiry
const ACCESS_TOKEN_TTL_MS = 14 * 60 * 1000

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        })

        if (!res.ok) return null

        const { accessToken, refreshToken, user } = await res.json()

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          isEmailVerified: user.isEmailVerified,
          accessToken,
          refreshToken,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          user: {
            id: user.id,
            email: user.email!,
            name: user.name!,
            role: user.role,
            subscriptionStatus: user.subscriptionStatus,
            isEmailVerified: user.isEmailVerified,
          },
        }
      }

      if (trigger === 'update' && session?.user) {
        token.user = { ...token.user, ...session.user }
        return token
      }

      if (Date.now() < token.accessTokenExpires) return token

      return refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      if (token.error) session.error = token.error
      return session
    },
  },

  pages: {
    signIn: '/login',
  },
}

async function refreshAccessToken(
  token: import('next-auth/jwt').JWT,
): Promise<import('next-auth/jwt').JWT> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    })

    if (!res.ok) throw new Error('refresh_failed')

    const { accessToken, refreshToken } = await res.json()

    return {
      ...token,
      accessToken,
      refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
      error: undefined,
    }
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
