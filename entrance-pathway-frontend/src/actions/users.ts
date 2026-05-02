'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAdmin, requireAuth } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, type ActionResult } from './utils';
import { sendWelcomeEmail } from './email';

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
  requestedCourseId?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields (admin views)
  requestedCourse?: { id: string; title: string } | null;
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

    const users = formatResponseArray(data || []) as User[];

    const courseIds = Array.from(
      new Set(users.map((u) => u.requestedCourseId).filter((id): id is string => Boolean(id)))
    );

    if (courseIds.length > 0) {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', courseIds);

      const courseMap = new Map((courses || []).map((c) => [c.id, c]));
      users.forEach((u) => {
        if (u.requestedCourseId) {
          const course = courseMap.get(u.requestedCourseId);
          u.requestedCourse = course ? { id: course.id, title: course.title } : null;
        }
      });
    }

    return { success: true, data: users };
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

    // When verifying, also enroll the user in the course they requested at signup
    if (isVerified && data?.requested_course_id) {
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', data.requested_course_id)
        .maybeSingle();

      if (!existing) {
        await supabase.from('enrollments').insert({
          user_id: userId,
          course_id: data.requested_course_id,
          progress: 0,
        });
      }
    }

    // Send welcome email when admin verifies the user
    if (isVerified && data) {
      sendWelcomeEmail(data.email, data.full_name || 'User').catch(() => {});
    }

    revalidatePath('/admin/users');
    return { success: true, data: formatResponse(data) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update verification status' };
  }
}

// Save phone, course, and optional payment reference after the user has authenticated via OTP
export async function saveSignupRequest(data: {
  phone: string;
  courseId: string;
  paymentReference?: string;
}): Promise<ActionResult<User>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const { data: updated, error } = await supabase
      .from('users')
      .update({
        phone: data.phone,
        requested_course_id: data.courseId,
        payment_reference: data.paymentReference || null,
        is_verified: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/users');
    return { success: true, data: formatResponse(updated) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save signup request' };
  }
}

// Hard-delete a user (admin reject). Removes from auth and the users row cascades.
export async function deleteUserAccount(userId: string): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    // Delete from auth.users — public.users row is removed via FK cascade or trigger
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw new Error(authError.message);

    // Best-effort cleanup of profile row (no-op if cascade already ran)
    await supabase.from('users').delete().eq('id', userId);

    revalidatePath('/admin/users');
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete user' };
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
