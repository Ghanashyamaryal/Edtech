'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireMentorOrAdmin } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, toSnakeCase, type ActionResult } from './utils';

// Types
export interface RecordedLecture {
  id: string;
  title: string;
  description?: string;
  instructorId?: string;
  courseId?: string;
  subjectId?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  viewCount: number;
  isPublished: boolean;
  instructor?: { id: string; fullName: string } | null;
  course?: { id: string; title: string } | null;
  subject?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordedLectureInput {
  title: string;
  description?: string;
  courseId?: string;
  subjectId?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
}

export interface UpdateRecordedLectureInput {
  title?: string;
  description?: string;
  courseId?: string;
  subjectId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  isPublished?: boolean;
}

// ============ QUERIES ============

export async function getRecordedLectures(options?: {
  subjectId?: string;
  courseId?: string;
  isPublished?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<RecordedLecture[]>> {
  try {
    const supabase = createAdminClient();
    const { subjectId, courseId, isPublished, search, limit = 20, offset = 0 } = options || {};

    let query = supabase
      .from('recorded_lectures')
      .select(`
        *,
        users:instructor_id (id, full_name),
        courses:course_id (id, title),
        subjects:subject_id (id, name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (subjectId) query = query.eq('subject_id', subjectId);
    if (courseId) query = query.eq('course_id', courseId);
    if (isPublished !== undefined) query = query.eq('is_published', isPublished);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const lectures = (data || []).map((l: any) => ({
      ...formatResponse(l),
      instructor: l.users ? { id: l.users.id, fullName: l.users.full_name } : null,
      course: l.courses || null,
      subject: l.subjects || null,
    }));

    return { success: true, data: lectures as RecordedLecture[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch lectures' };
  }
}

export async function getRecordedLecture(id: string): Promise<ActionResult<RecordedLecture>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('recorded_lectures')
      .select(`
        *,
        users:instructor_id (id, full_name),
        courses:course_id (id, title),
        subjects:subject_id (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Lecture not found');
      throw new Error(error.message);
    }

    const lecture = {
      ...formatResponse(data),
      instructor: data.users ? { id: data.users.id, fullName: data.users.full_name } : null,
      course: data.courses || null,
      subject: data.subjects || null,
    };

    return { success: true, data: lecture as RecordedLecture };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch lecture' };
  }
}

export async function getPublishedLectures(options?: {
  subjectId?: string;
  courseId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<RecordedLecture[]>> {
  return getRecordedLectures({ ...options, isPublished: true });
}

// ============ MUTATIONS ============

export async function createRecordedLecture(input: CreateRecordedLectureInput): Promise<ActionResult<RecordedLecture>> {
  try {
    const user = await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('recorded_lectures')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        instructor_id: user.id,
        view_count: 0,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/recorded-lectures');
    revalidatePath('/admin/recorded-lectures');
    return { success: true, data: formatResponse(data) as RecordedLecture };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create lecture' };
  }
}

export async function updateRecordedLecture(
  id: string,
  input: UpdateRecordedLectureInput
): Promise<ActionResult<RecordedLecture>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('recorded_lectures')
      .update(toSnakeCase(input as unknown as Record<string, unknown>))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/recorded-lectures');
    revalidatePath('/admin/recorded-lectures');
    return { success: true, data: formatResponse(data) as RecordedLecture };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update lecture' };
  }
}

export async function deleteRecordedLecture(id: string): Promise<ActionResult<boolean>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from('recorded_lectures').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/recorded-lectures');
    revalidatePath('/admin/recorded-lectures');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete lecture' };
  }
}

export async function publishRecordedLecture(id: string): Promise<ActionResult<RecordedLecture>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('recorded_lectures')
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/recorded-lectures');
    revalidatePath('/admin/recorded-lectures');
    return { success: true, data: formatResponse(data) as RecordedLecture };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to publish lecture' };
  }
}

export async function incrementLectureView(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { data: lecture } = await supabase
      .from('recorded_lectures')
      .select('view_count')
      .eq('id', id)
      .single();

    const newCount = (lecture?.view_count || 0) + 1;

    const { error } = await supabase
      .from('recorded_lectures')
      .update({ view_count: newCount })
      .eq('id', id);

    if (error) throw new Error(error.message);

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to increment view count' };
  }
}
