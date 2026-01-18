// Re-export auth hooks from context for backward compatibility
// New code should import directly from '@/context'
export { useAuth, useRole, useRequireAuth, useRequireRole } from '@/context';
