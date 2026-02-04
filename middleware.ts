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

  const publicRoutes = [ROUTES.LOGIN] // Define public routes

  // Redirect authenticated users from login page to boards
  if (session && request.nextUrl.pathname === ROUTES.LOGIN) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = ROUTES.BOARDS
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect unauthenticated users from protected routes to login
  if (!session && !publicRoutes.includes(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = ROUTES.LOGIN
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [ROUTES.HOME, ROUTES.LOGIN, `${ROUTES.BOARDS}/:path*`],
}
