import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/landing']
const AUTH_PATHS = ['/login', '/register']

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Authenticated users get bounced to dashboard from public/auth pages
    if (
      req.nextauth.token &&
      (pathname === '/' ||
        PUBLIC_PATHS.some((p) => pathname === p) ||
        AUTH_PATHS.some((p) => pathname.startsWith(p)))
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public marketing + auth pages are always accessible
        if (
          pathname === '/' ||
          PUBLIC_PATHS.some((p) => pathname === p) ||
          AUTH_PATHS.some((p) => pathname.startsWith(p))
        ) {
          return true
        }

        // Everything else requires a session
        return !!token
      },
    },
    pages: { signIn: '/login' },
  },
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
