'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAuth, requireMentorOrAdmin } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, type ActionResult } from './utils';

// Types
export interface Chapter {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  courseId: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  chapterId: string;
}

export interface CreateChapterInput {
  courseId: string;
  title: string;
  description?: string;
}

export interface CreateLessonInput {
  chapterId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  isFree?: boolean;
}

// ============ CHAPTER QUERIES ============

export async function getChapters(courseId: string): Promise<ActionResult<Chapter[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('course_id', courseId)
      .order('position');

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponseArray(data || []) as Chapter[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch chapters' };
  }
}

export async function getChapter(id: string): Promise<ActionResult<Chapter>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponse(data) as Chapter };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch chapter' };
  }
}

export async function getChapterWithLessons(id: string): Promise<ActionResult<Chapter & { lessons: Lesson[] }>> {
  try {
    const supabase = createAdminClient();

    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single();

    if (chapterError) throw new Error(chapterError.message);

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', id)
      .order('position');

    if (lessonsError) throw new Error(lessonsError.message);

    return {
      success: true,
      data: {
        ...formatResponse(chapter) as Chapter,
        lessons: formatResponseArray(lessons || []) as Lesson[],
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch chapter' };
  }
}

// ============ CHAPTER MUTATIONS ============

export async function createChapter(input: CreateChapterInput): Promise<ActionResult<Chapter>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    // Get the current max position for this course
    const { data: existing } = await supabase
      .from('chapters')
      .select('position')
      .eq('course_id', input.courseId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 1;

    const { data, error } = await supabase
      .from('chapters')
      .insert({
        course_id: input.courseId,
        title: input.title,
        description: input.description,
        position: nextPosition,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${input.courseId}/chapters`);
    return { success: true, data: formatResponse(data) as Chapter };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create chapter' };
  }
}

export async function updateChapter(
  id: string,
  input: { title?: string; description?: string }
): Promise<ActionResult<Chapter>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('chapters')
      .update({
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const chapter = formatResponse(data) as Chapter;
    revalidatePath(`/admin/courses/${chapter.courseId}/chapters`);
    return { success: true, data: chapter };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update chapter' };
  }
}

export async function deleteChapter(id: string): Promise<ActionResult<boolean>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    // Get course ID before deleting
    const { data: chapter } = await supabase
      .from('chapters')
      .select('course_id')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('chapters').delete().eq('id', id);

    if (error) throw new Error(error.message);

    if (chapter) {
      revalidatePath(`/admin/courses/${chapter.course_id}/chapters`);
    }
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete chapter' };
  }
}

export async function reorderChapters(
  courseId: string,
  chapterIds: string[]
): Promise<ActionResult<Chapter[]>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    // Update positions
    const updates = chapterIds.map((id, index) =>
      supabase
        .from('chapters')
        .update({ position: index + 1 })
        .eq('id', id)
    );

    await Promise.all(updates);

    // Fetch updated chapters
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('course_id', courseId)
      .order('position');

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: formatResponseArray(data || []) as Chapter[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder chapters' };
  }
}

// ============ LESSON QUERIES ============

export async function getLessons(chapterId: string): Promise<ActionResult<Lesson[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('position');

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponseArray(data || []) as Lesson[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch lessons' };
  }
}

export async function getLesson(id: string): Promise<ActionResult<Lesson>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponse(data) as Lesson };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch lesson' };
  }
}

// ============ LESSON MUTATIONS ============

export async function createLesson(input: CreateLessonInput): Promise<ActionResult<Lesson>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    // Get the current max position for this chapter
    const { data: existing } = await supabase
      .from('lessons')
      .select('position')
      .eq('chapter_id', input.chapterId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 1;

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        chapter_id: input.chapterId,
        title: input.title,
        description: input.description,
        video_url: input.videoUrl,
        is_free: input.isFree ?? false,
        position: nextPosition,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Get course ID for revalidation
    const { data: chapter } = await supabase
      .from('chapters')
      .select('course_id')
      .eq('id', input.chapterId)
      .single();

    if (chapter) {
      revalidatePath(`/admin/courses/${chapter.course_id}/chapters`);
    }

    return { success: true, data: formatResponse(data) as Lesson };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create lesson' };
  }
}

export async function updateLesson(
  id: string,
  input: { title?: string; description?: string; videoUrl?: string; isFree?: boolean }
): Promise<ActionResult<Lesson>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('lessons')
      .update({
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.videoUrl !== undefined && { video_url: input.videoUrl }),
        ...(input.isFree !== undefined && { is_free: input.isFree }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const lesson = formatResponse(data) as Lesson;

    // Get course ID for revalidation
    const { data: chapter } = await supabase
      .from('chapters')
      .select('course_id')
      .eq('id', lesson.chapterId)
      .single();

    if (chapter) {
      revalidatePath(`/admin/courses/${chapter.course_id}/chapters`);
    }

    return { success: true, data: lesson };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update lesson' };
  }
}

export async function deleteLesson(id: string): Promise<ActionResult<boolean>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    // Get chapter ID before deleting
    const { data: lesson } = await supabase
      .from('lessons')
      .select('chapter_id')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('lessons').delete().eq('id', id);

    if (error) throw new Error(error.message);

    if (lesson) {
      const { data: chapter } = await supabase
        .from('chapters')
        .select('course_id')
        .eq('id', lesson.chapter_id)
        .single();

      if (chapter) {
        revalidatePath(`/admin/courses/${chapter.course_id}/chapters`);
      }
    }

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete lesson' };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessonIds: string[]
): Promise<ActionResult<Lesson[]>> {
  try {
    await requireMentorOrAdmin();
    const supabase = createAdminClient();

    // Update positions
    const updates = lessonIds.map((id, index) =>
      supabase
        .from('lessons')
        .update({ position: index + 1 })
        .eq('id', id)
    );

    await Promise.all(updates);

    // Fetch updated lessons
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('position');

    if (error) throw new Error(error.message);

    // Get course ID for revalidation
    const { data: chapter } = await supabase
      .from('chapters')
      .select('course_id')
      .eq('id', chapterId)
      .single();

    if (chapter) {
      revalidatePath(`/admin/courses/${chapter.course_id}/chapters`);
    }

    return { success: true, data: formatResponseArray(data || []) as Lesson[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder lessons' };
  }
}

// ============ LESSON PROGRESS ============

export async function updateLessonProgress(
  lessonId: string,
  watchedDuration: number,
  isCompleted?: boolean
): Promise<ActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          watched_duration: watchedDuration,
          is_completed: isCompleted ?? existing.is_completed,
          completed_at: isCompleted ? new Date().toISOString() : existing.completed_at,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { success: true, data: formatResponse(data) };
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        watched_duration: watchedDuration,
        is_completed: isCompleted ?? false,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data: formatResponse(data) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update lesson progress' };
  }
}
