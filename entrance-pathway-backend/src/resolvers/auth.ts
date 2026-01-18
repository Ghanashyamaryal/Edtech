import { supabaseAdmin } from '../config';
import { Context } from './types';
import { formatResponse } from '../utils/helpers';
import { AuthenticationError, ForbiddenError, ValidationError, DatabaseError } from '../utils/errors';

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'mentor' | 'admin';
  phone?: string;
}

interface SignInInput {
  email: string;
  password: string;
}

interface UpdateProfileInput {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const authResolvers = {
  Query: {
    // Get current authenticated user
    me: async (_: unknown, __: unknown, context: Context) => {
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

    // Alias for me query
    getCurrentUser: async (_: unknown, __: unknown, context: Context) => {
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

    // Get user profile by ID (public profiles)
    getUserProfile: async (_: unknown, { userId }: { userId: string }) => {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, full_name, avatar_url, role, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },
  },

  Mutation: {
    // Sign up new user
    signUp: async (_: unknown, { input }: { input: SignUpInput }) => {
      const { email, password, fullName, role, phone } = input;

      // Validate role (prevent admin self-registration)
      if (role === 'admin') {
        throw new ForbiddenError('Admin accounts cannot be self-registered');
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // Require email verification
        user_metadata: {
          full_name: fullName,
          role,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new ValidationError('Email is already registered');
        }
        throw new AuthenticationError(authError.message);
      }

      if (!authData.user) {
        throw new AuthenticationError('Failed to create user');
      }

      // Create user profile in database
      const { data: userData, error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
          phone,
        })
        .select()
        .single();

      if (dbError) {
        // Rollback: delete auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new DatabaseError('Failed to create user profile');
      }

      // Generate access token for the new user
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });

      // Return user and a placeholder token (actual token comes from client-side sign in)
      return {
        user: formatResponse(userData),
        accessToken: sessionData?.properties?.hashed_token || '',
      };
    },

    // Sign in existing user
    signIn: async (_: unknown, { input }: { input: SignInInput }) => {
      const { email, password } = input;

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new AuthenticationError('Invalid email or password');
      }

      if (!authData.user || !authData.session) {
        throw new AuthenticationError('Sign in failed');
      }

      // Get user profile
      const { data: userData, error: dbError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (dbError) {
        throw new DatabaseError('Failed to fetch user profile');
      }

      return {
        user: formatResponse(userData),
        accessToken: authData.session.access_token,
      };
    },

    // Update user profile
    updateProfile: async (
      _: unknown,
      { input }: { input: UpdateProfileInput },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (input.fullName) updateData.full_name = input.fullName;
      if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl;
      if (input.phone !== undefined) updateData.phone = input.phone;

      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', context.user.id)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(error.message);
      }

      // Also update Supabase Auth metadata
      await supabaseAdmin.auth.admin.updateUserById(context.user.id, {
        user_metadata: {
          full_name: input.fullName || data.full_name,
          avatar_url: input.avatarUrl || data.avatar_url,
        },
      });

      return formatResponse(data);
    },

    // Change password
    changePassword: async (
      _: unknown,
      { input }: { input: ChangePasswordInput },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      // Get user email
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('id', context.user.id)
        .single();

      if (!userData) {
        throw new AuthenticationError('User not found');
      }

      // Verify current password by attempting sign in
      const { error: verifyError } = await supabaseAdmin.auth.signInWithPassword({
        email: userData.email,
        password: input.currentPassword,
      });

      if (verifyError) {
        throw new ValidationError('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        context.user.id,
        { password: input.newPassword }
      );

      if (updateError) {
        throw new AuthenticationError('Failed to update password');
      }

      return true;
    },

    // Update user role (admin only)
    updateUserRole: async (
      _: unknown,
      { userId, role }: { userId: string; role: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }

      // Prevent changing own role
      if (userId === context.user.id) {
        throw new ForbiddenError('Cannot change your own role');
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(error.message);
      }

      // Update role in auth metadata
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { role },
      });

      return formatResponse(data);
    },
  },
};
