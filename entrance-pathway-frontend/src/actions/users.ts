'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, createClient, requireAdmin, requireAuth } from '@/lib/supabase/server';
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
  isPremium?: boolean;
  premiumUntil?: string | null;
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

// Save phone, course, and optional payment reference after the user has authenticated via OTP.
// Robust to all of these:
//   - profile row may or may not exist yet (auth-context auto-create can race)
//   - the requested_course_id / payment_reference columns may not be present yet
//     if the migration hasn't been applied — falls back to writing only the columns
//     we know exist (phone + is_verified)
export async function saveSignupRequest(data: {
  phone: string;
  courseId: string;
  paymentReference?: string;
}): Promise<ActionResult<User>> {
  try {
    const ssrClient = await createClient();
    const { data: { user: authUser }, error: authError } = await ssrClient.auth.getUser();
    if (authError || !authUser) {
      return { success: false, error: 'Unauthorized: please verify your email first' };
    }
    if (!authUser.email) {
      return { success: false, error: 'Your account is missing an email address' };
    }

    const supabase = createAdminClient();

    // Try update first — common case: auth-context already inserted the profile row.
    const fullPayload: Record<string, unknown> = {
      phone: data.phone,
      requested_course_id: data.courseId,
      payment_reference: data.paymentReference || null,
      is_verified: false,
      updated_at: new Date().toISOString(),
    };

    const updateRes = await supabase
      .from('users')
      .update(fullPayload)
      .eq('id', authUser.id)
      .select();

    let updated = updateRes.data?.[0] ?? null;
    let updateError = updateRes.error;

    // If the migration isn't applied yet, retry without the new columns so the
    // user isn't blocked from completing signup.
    if (
      updateError &&
      /column .* does not exist/i.test(updateError.message)
    ) {
      const minimalRes = await supabase
        .from('users')
        .update({
          phone: data.phone,
          is_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id)
        .select();
      updated = minimalRes.data?.[0] ?? null;
      updateError = minimalRes.error;
    }

    if (updateError) {
      return { success: false, error: `Failed to save: ${updateError.message}` };
    }

    // No row matched — profile not auto-created yet. Insert it.
    if (!updated) {
      const insertRes = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || 'User',
          role: 'student',
          ...fullPayload,
        })
        .select()
        .single();

      if (insertRes.error) {
        return { success: false, error: `Failed to create profile: ${insertRes.error.message}` };
      }
      updated = insertRes.data;
    }

    try {
      revalidatePath('/admin/users');
    } catch {
      // revalidatePath should never throw inside a server action, but if it does
      // we don't want to fail the user's signup over a cache miss.
    }

    return { success: true, data: formatResponse(updated) as User };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save signup request',
    };
  }
}

export interface ActiveCourse {
  id: string;
  title: string;
  slug: string;
}

// Returns the course the current user is "studying" — drives all dashboard scoping.
// Prefers the verified enrollment (created when admin verifies the user); falls back
// to the requested_course_id captured at signup so partially-onboarded users still
// see something coherent.
export async function getActiveCourse(): Promise<ActionResult<ActiveCourse | null>> {
  try {
    const ssrClient = await createClient();
    const { data: { user: authUser }, error: authError } = await ssrClient.auth.getUser();
    if (authError || !authUser) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = createAdminClient();

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('course:courses(id, title, slug)')
      .eq('user_id', authUser.id)
      .limit(1)
      .maybeSingle();

    const enrolled = (enrollment as { course?: { id: string; title: string; slug: string } } | null)?.course;
    if (enrolled?.id) {
      return { success: true, data: { id: enrolled.id, title: enrolled.title, slug: enrolled.slug } };
    }

    const { data: profile } = await supabase
      .from('users')
      .select('requested_course_id')
      .eq('id', authUser.id)
      .maybeSingle();

    const requestedId = (profile as { requested_course_id?: string } | null)?.requested_course_id;
    if (!requestedId) {
      return { success: true, data: null };
    }

    const { data: course } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('id', requestedId)
      .maybeSingle();

    if (!course) return { success: true, data: null };

    return { success: true, data: { id: course.id, title: course.title, slug: course.slug } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to load active course' };
  }
}

// Returns whether the current user has active premium access (lifetime or
// not-yet-expired). Used by note-download gating.
export async function getCurrentPremiumStatus(): Promise<ActionResult<{
  isPremium: boolean;
  premiumUntil: string | null;
}>> {
  try {
    const ssrClient = await createClient();
    const { data: { user: authUser } } = await ssrClient.auth.getUser();
    if (!authUser) return { success: true, data: { isPremium: false, premiumUntil: null } };

    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from('users')
      .select('is_premium, premium_until')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!profile) return { success: true, data: { isPremium: false, premiumUntil: null } };

    const premiumUntil = (profile as { premium_until?: string | null }).premium_until ?? null;
    const isPremium =
      !!(profile as { is_premium?: boolean }).is_premium &&
      (!premiumUntil || new Date(premiumUntil) > new Date());

    return { success: true, data: { isPremium, premiumUntil } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to check premium status' };
  }
}

// Admin-only: flip the premium flag. `until` is optional — pass undefined for
// lifetime access, or an ISO date for time-bounded.
export async function grantPremium(
  userId: string,
  isPremium: boolean,
  until?: string | null
): Promise<ActionResult<User>> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const updatePayload: Record<string, unknown> = {
      is_premium: isPremium,
      premium_until: isPremium ? (until ?? null) : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/users');
    return { success: true, data: formatResponse(data) as User };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update premium status' };
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
