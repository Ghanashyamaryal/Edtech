import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type UserRole = 'student' | 'mentor' | 'admin';

interface RouteConfig {
  path: string;
  allowedRoles?: UserRole[];
  requireAuth: boolean;
}

// Route configuration with role-based access
const routeConfigs: RouteConfig[] = [
  // Public routes (no auth required)
  { path: '/auth', requireAuth: false },
  { path: '/', requireAuth: false },

  // Protected routes (any authenticated user)
  { path: '/dashboard', requireAuth: true },
  { path: '/profile', requireAuth: true },
  { path: '/courses', requireAuth: false },
  { path: '/exams', requireAuth: true },

  // Pending verification (auth required, but no verification check)
  { path: '/pending-verification', requireAuth: true },

  // Admin user management — admin-only
  { path: '/admin/users', requireAuth: true, allowedRoles: ['admin'] },
  // Rest of /admin — mentors can access content management; users page above is excluded
  { path: '/admin', requireAuth: true, allowedRoles: ['admin', 'mentor'] },
  { path: '/mentor', requireAuth: true, allowedRoles: ['mentor', 'admin'] },
  { path: '/instructor', requireAuth: true, allowedRoles: ['mentor', 'admin'] },
];

function getRouteConfig(pathname: string): RouteConfig | null {
  // Find the most specific matching route
  const matchingConfigs = routeConfigs.filter((config) =>
    pathname.startsWith(config.path)
  );

  if (matchingConfigs.length === 0) {
    return null;
  }

  // Return the most specific match (longest path)
  return matchingConfigs.reduce((a, b) =>
    a.path.length > b.path.length ? a : b
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Always validate user server-side (also refreshes cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users away from auth pages (except callback)
  if (pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const routeConfig = getRouteConfig(pathname);

  // If no specific config found, allow access
  if (!routeConfig) {
    return supabaseResponse;
  }

  // If route doesn't require auth, allow access
  if (!routeConfig.requireAuth) {
    return supabaseResponse;
  }

  // If route requires auth but user is not authenticated
  if (!user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Get user profile to check role and verification status
  const { data: profile } = await supabase
    .from('users')
    .select('role, is_verified')
    .eq('id', user.id)
    .single();

  // If profile fetch failed (e.g. column doesn't exist yet), allow access
  if (!profile) {
    return supabaseResponse;
  }

  const userRole = (profile.role as UserRole) || 'student';
  const isVerified = profile.is_verified ?? false;

  // If route has role restrictions, check user role
  if (routeConfig.allowedRoles && routeConfig.allowedRoles.length > 0) {
    if (!routeConfig.allowedRoles.includes(userRole)) {
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      unauthorizedUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Block unverified non-admin users from accessing protected routes
  // Allow access to /pending-verification page itself
  if (
    routeConfig.requireAuth &&
    userRole !== 'admin' &&
    !isVerified &&
    !pathname.startsWith('/pending-verification')
  ) {
    return NextResponse.redirect(new URL('/pending-verification', request.url));
  }

  return supabaseResponse;
}
