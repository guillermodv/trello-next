import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES } from '@/lib/constants'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // If logged in, redirect from /login to /boards
  if (session && pathname === ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.BOARDS, request.url))
  }

  // If not logged in, redirect from any protected route to /login
  if (!session && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
  }

  // If logged in, redirect from / to /boards
  if (session && pathname === ROUTES.HOME) {
    return NextResponse.redirect(new URL(ROUTES.BOARDS, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - any files in the public folder (e.g., images, fonts)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\..*).*)',
  ],
}

