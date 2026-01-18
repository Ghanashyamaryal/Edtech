import { AuthUser } from '../middleware/auth';

export interface Context {
  user: AuthUser | null;
  token: string | null;
}

export interface PaginationArgs {
  limit?: number;
  offset?: number;
}
