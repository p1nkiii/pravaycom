import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  let response: NextResponse

  if (request.nextUrl.pathname.startsWith('/api')) {
    response = NextResponse.next({ request })
  } else {
    response = await updateSession(request)
  }

  // Ensure CSRF token cookie exists for all routes
  const existingCsrf = request.cookies.get('csrfToken')?.value
  if (!existingCsrf) {
    const token = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) as string
    response.cookies.set('csrfToken', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
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
     * - api/webhooks (webhook endpoints - no auth needed)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}