import { Context } from '../resolvers/types';
import { AuthenticationError, ForbiddenError } from './errors';
import type { UserRole } from '../middleware/auth';

// Higher-order function to wrap resolvers with authentication check
export function requireAuth<TArgs, TResult>(
  resolver: (parent: unknown, args: TArgs, context: Context) => Promise<TResult>
) {
  return async (parent: unknown, args: TArgs, context: Context): Promise<TResult> => {
    if (!context.user) {
      throw new AuthenticationError('Authentication required');
    }
    return resolver(parent, args, context);
  };
}

// Higher-order function to wrap resolvers with role check
export function requireRole<TArgs, TResult>(
  roles: UserRole[],
  resolver: (parent: unknown, args: TArgs, context: Context) => Promise<TResult>
) {
  return async (parent: unknown, args: TArgs, context: Context): Promise<TResult> => {
    if (!context.user) {
      throw new AuthenticationError('Authentication required');
    }
    if (!roles.includes(context.user.role as UserRole)) {
      throw new ForbiddenError(`This action requires one of the following roles: ${roles.join(', ')}`);
    }
    return resolver(parent, args, context);
  };
}

// Specific role guards
export function adminOnly<TArgs, TResult>(
  resolver: (parent: unknown, args: TArgs, context: Context) => Promise<TResult>
) {
  return requireRole(['admin'], resolver);
}

export function mentorOnly<TArgs, TResult>(
  resolver: (parent: unknown, args: TArgs, context: Context) => Promise<TResult>
) {
  return requireRole(['mentor', 'admin'], resolver);
}

export function instructorOnly<TArgs, TResult>(
  resolver: (parent: unknown, args: TArgs, context: Context) => Promise<TResult>
) {
  return requireRole(['mentor', 'admin'], resolver);
}

// Check if user has access to a resource
export function checkOwnership(
  context: Context,
  ownerId: string,
  allowAdmin: boolean = true
): void {
  if (!context.user) {
    throw new AuthenticationError('Authentication required');
  }

  const isOwner = context.user.id === ownerId;
  const isAdmin = context.user.role === 'admin';

  if (!isOwner && !(allowAdmin && isAdmin)) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }
}

// Check if user can modify a resource (owner or admin)
export function checkModifyPermission(
  context: Context,
  ownerId: string
): void {
  checkOwnership(context, ownerId, true);
}

// Check if user is at least a mentor
export function isMentorOrAdmin(context: Context): boolean {
  if (!context.user) return false;
  return ['mentor', 'admin'].includes(context.user.role);
}

// Check if user is admin
export function isAdmin(context: Context): boolean {
  if (!context.user) return false;
  return context.user.role === 'admin';
}

// Assert user is authenticated
export function assertAuthenticated(context: Context): asserts context is Context & { user: NonNullable<Context['user']> } {
  if (!context.user) {
    throw new AuthenticationError('Authentication required');
  }
}

// Assert user has one of the specified roles
export function assertRole(context: Context, roles: UserRole[]): void {
  assertAuthenticated(context);
  if (!roles.includes(context.user.role as UserRole)) {
    throw new ForbiddenError(`This action requires one of the following roles: ${roles.join(', ')}`);
  }
}

// Assert user is admin
export function assertAdmin(context: Context): void {
  assertRole(context, ['admin']);
}

// Assert user is mentor or admin
export function assertMentorOrAdmin(context: Context): void {
  assertRole(context, ['mentor', 'admin']);
}

// Decorator-style guard for class-based resolvers
export function Guard(roles?: UserRole[]) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const context = args[2] as Context;

      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      if (roles && roles.length > 0) {
        if (!roles.includes(context.user.role as UserRole)) {
          throw new ForbiddenError(`This action requires one of the following roles: ${roles.join(', ')}`);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
