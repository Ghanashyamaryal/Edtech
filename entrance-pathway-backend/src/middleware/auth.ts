import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { supabaseAdmin } from '../config';

export type UserRole = 'student' | 'mentor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  token?: string;
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Verify Supabase JWT token
export function verifySupabaseToken(token: string): AuthUser | null {
  try {
    // Supabase JWTs use the JWT_SECRET from your Supabase project
    // The secret should be set in your environment variables
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      email?: string;
      role?: string;
      user_metadata?: {
        role?: string;
      };
      app_metadata?: {
        role?: string;
      };
    };

    // Get role from various possible locations in the JWT
    const role = (
      decoded.role ||
      decoded.user_metadata?.role ||
      decoded.app_metadata?.role ||
      'student'
    ) as UserRole;

    return {
      id: decoded.sub,
      email: decoded.email || '',
      role,
    };
  } catch (error) {
    // Token verification failed
    return null;
  }
}

// Alternative: Verify token by calling Supabase API (more secure but slower)
export async function verifyTokenWithSupabase(token: string): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    // Get user profile for role
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      role: (profile?.role as UserRole) || 'student',
    };
  } catch {
    return null;
  }
}

// Express middleware for authentication
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (token) {
    const user = verifySupabaseToken(token);
    if (user) {
      req.user = user;
      req.token = token;
    }
  }

  next();
}

// Async middleware that verifies with Supabase API (more secure)
export function authMiddlewareAsync(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  verifyTokenWithSupabase(token)
    .then((user) => {
      if (user) {
        req.user = user;
        req.token = token;
      }
      next();
    })
    .catch(() => {
      next();
    });
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// GraphQL context creator for Apollo Server
export function createGraphQLContext(req: AuthenticatedRequest) {
  return {
    user: req.user || null,
    token: req.token || null,
  };
}
