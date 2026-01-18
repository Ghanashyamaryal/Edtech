import { supabaseAdmin } from '../config';
import { Context, PaginationArgs } from './types';
import { formatResponse, formatResponseArray } from '../utils/helpers';
import { AuthenticationError, NotFoundError, DatabaseError } from '../utils/errors';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) return null;

      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', context.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },

    user: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('User');
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },

    users: async (
      _: any,
      { role, limit = 20, offset = 0 }: PaginationArgs & { role?: string },
      context: Context
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Admin access required');
      }

      let query = supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (role) {
        query = query.eq('role', role);
      }

      const { data, error } = await query;

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },
  },
};
