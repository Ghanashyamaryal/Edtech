'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAdmin, requireAuth } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, type ActionResult } from './utils';

// Types
export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  isVerified?: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ============ QUERIES ============

export async function getUsers(options?: {
  role?: UserRole;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<User[]>> {
  try {
    const supabase = createAdminClient();

    const { role, limit = 50, offset = 0 } = options || {};

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponseArray(data || []) as User[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch users' };
  }
}

export async function getUser(id: string): Promise<ActionResult<User>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('User not found');
      throw new Error(error.message);
    }

    return { success: true, data: formatResponse(data) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch user' };
  }
}

export async function getCurrentUserProfile(): Promise<ActionResult<User>> {
  try {
    const user = await requireAuth();
    return { success: true, data: formatResponse(user) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch profile' };
  }
}

// ============ MUTATIONS ============

export async function updateUserRole(userId: string, role: UserRole): Promise<ActionResult<User>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/users');
    return { success: true, data: formatResponse(data) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update user role' };
  }
}

export async function updateUserVerification(
  userId: string,
  isVerified: boolean
): Promise<ActionResult<User>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: isVerified })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/users');
    return { success: true, data: formatResponse(data) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update verification status' };
  }
}

export async function updateProfile(
  data: { fullName?: string; phone?: string; avatarUrl?: string }
): Promise<ActionResult<User>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true, data: formatResponse(updatedUser) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' };
  }
}

// ============ STATS ============

export async function getDashboardStats(): Promise<ActionResult<{
  totalUsers: number;
  totalCourses: number;
  totalExams: number;
  totalQuestions: number;
}>> {
  try {
    const supabase = createAdminClient();

    const [usersResult, coursesResult, examsResult, questionsResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('exams').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
    ]);

    return {
      success: true,
      data: {
        totalUsers: usersResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalExams: examsResult.count || 0,
        totalQuestions: questionsResult.count || 0,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch stats' };
  }
}
