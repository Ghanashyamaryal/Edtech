'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireMentorOrAdmin } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, toSnakeCase, type ActionResult } from './utils';

// Types
export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  instructorId?: string;
  courseId?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  meetingId?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  maxStudents?: number;
  recordingUrl?: string;
  instructor?: { id: string; fullName: string } | null;
  course?: { id: string; title: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLiveClassInput {
  title: string;
  description?: string;
  courseId?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  meetingId?: string;
  maxStudents?: number;
}

export interface UpdateLiveClassInput {
  title?: string;
  description?: string;
  courseId?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  meetingUrl?: string;
  meetingId?: string;
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
  maxStudents?: number;
  recordingUrl?: string;
}

// ============ QUERIES ============

export async function getLiveClasses(options?: {
  status?: string;
  courseId?: string;
  limit?: number;
}): Promise<ActionResult<LiveClass[]>> {
  try {
    const supabase = createAdminClient();
    const { status, courseId, limit = 20 } = options || {};

    let query = supabase
      .from('live_classes')
      .select(`
        *,
        users:instructor_id (id, full_name),
        courses:course_id (id, title)
      `)
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (status) query = query.eq('status', status);
    if (courseId) query = query.eq('course_id', courseId);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const classes = (data || []).map((c: any) => ({
      ...formatResponse(c),
      instructor: c.users ? { id: c.users.id, fullName: c.users.full_name } : null,
      course: c.courses || null,
    }));

    return { success: true, data: classes as LiveClass[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch live classes' };
  }
}

export async function getLiveClass(id: string): Promise<ActionResult<LiveClass>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('live_classes')
      .select(`
        *,
        users:instructor_id (id, full_name),
        courses:course_id (id, title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Live class not found');
      throw new Error(error.message);
    }

    const liveClass = {
      ...formatResponse(data),
      instructor: data.users ? { id: data.users.id, fullName: data.users.full_name } : null,
      course: data.courses || null,
    };

    return { success: true, data: liveClass as LiveClass };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch live class' };
  }
}

export async function getUpcomingLiveClasses(): Promise<ActionResult<LiveClass[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('live_classes')
      .select(`
        *,
        users:instructor_id (id, full_name),
        courses:course_id (id, title)
      `)
      .in('status', ['scheduled', 'live'])
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10);

    if (error) throw new Error(error.message);

    const classes = (data || []).map((c: any) => ({
      ...formatResponse(c),
      instructor: c.users ? { id: c.users.id, fullName: c.users.full_name } : null,
      course: c.courses || null,
    }));

    return { success: true, data: classes as LiveClass[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch upcoming classes' };
  }
}

export async function getLiveNowClasses(): Promise<ActionResult<LiveClass[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('live_classes')
      .select(`
        *,
        users:instructor_id (id, full_name),
        courses:course_id (id, title)
      `)
      .eq('status', 'live')
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);

    const classes = (data || []).map((c: any) => ({
      ...formatResponse(c),
      instructor: c.users ? { id: c.users.id, fullName: c.users.full_name } : null,
      course: c.courses || null,
    }));

    return { success: true, data: classes as LiveClass[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch live classes' };
  }
}

// ============ MUTATIONS ============

export async function createLiveClass(input: CreateLiveClassInput): Promise<ActionResult<LiveClass>> {
  try {
    const user = await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('live_classes')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        instructor_id: user.id,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/live-classes');
    revalidatePath('/admin/live-classes');
    return { success: true, data: formatResponse(data) as LiveClass };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create live class' };
  }
}

export async function updateLiveClass(id: string, input: UpdateLiveClassInput): Promise<ActionResult<LiveClass>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('live_classes')
      .update(toSnakeCase(input as unknown as Record<string, unknown>))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/live-classes');
    revalidatePath('/admin/live-classes');
    return { success: true, data: formatResponse(data) as LiveClass };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update live class' };
  }
}

export async function deleteLiveClass(id: string): Promise<ActionResult<boolean>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from('live_classes').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/live-classes');
    revalidatePath('/admin/live-classes');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete live class' };
  }
}
