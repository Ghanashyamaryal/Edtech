'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAdmin, requireMentorOrAdmin } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, type ActionResult } from './utils';

// Types
export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  topicsCount?: number;
  questionsCount?: number;
  notesCount?: number;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  questionsCount?: number;
}

export interface CourseSubject {
  id: string;
  courseId: string;
  subjectId: string;
  displayOrder: number;
  subject?: Subject;
}

export interface CreateSubjectInput {
  name: string;
  description?: string;
  icon?: string;
}

export interface CreateTopicInput {
  subjectId: string;
  name: string;
  description?: string;
}

// ============ SUBJECT QUERIES ============

export async function getSubjects(): Promise<ActionResult<Subject[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);

    // Add counts
    const subjectsWithCounts = await Promise.all(
      (data || []).map(async (subject) => {
        const [topicsCount, questionsCount, notesCount] = await Promise.all([
          getTopicsCount(subject.id),
          getSubjectQuestionsCount(subject.id),
          getSubjectNotesCount(subject.id),
        ]);

        return {
          ...formatResponse(subject),
          topicsCount,
          questionsCount,
          notesCount,
        };
      })
    );

    return { success: true, data: subjectsWithCounts as Subject[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch subjects' };
  }
}

export async function getSubject(id: string): Promise<ActionResult<Subject>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Subject not found');
      throw new Error(error.message);
    }

    const [topicsCount, questionsCount, notesCount] = await Promise.all([
      getTopicsCount(id),
      getSubjectQuestionsCount(id),
      getSubjectNotesCount(id),
    ]);

    return {
      success: true,
      data: { ...formatResponse(data), topicsCount, questionsCount, notesCount } as Subject,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch subject' };
  }
}

export async function getCourseSubjects(courseId: string): Promise<ActionResult<CourseSubject[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('course_subjects')
      .select('*, subject:subjects(*)')
      .eq('course_id', courseId)
      .order('display_order');

    if (error) throw new Error(error.message);

    const courseSubjects = await Promise.all(
      (data || []).map(async (cs) => {
        const [topicsCount, questionsCount] = await Promise.all([
          getTopicsCount(cs.subject_id),
          getSubjectQuestionsCount(cs.subject_id),
        ]);

        return {
          ...formatResponse(cs),
          subject: cs.subject
            ? { ...formatResponse(cs.subject), topicsCount, questionsCount }
            : null,
        };
      })
    );

    return { success: true, data: courseSubjects as CourseSubject[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch course subjects' };
  }
}

// ============ SUBJECT MUTATIONS ============

export async function createSubject(input: CreateSubjectInput): Promise<ActionResult<Subject>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('subjects')
      .insert({
        name: input.name,
        description: input.description,
        icon: input.icon,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/subjects');
    return { success: true, data: formatResponse(data) as Subject };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create subject' };
  }
}

export async function updateSubject(
  id: string,
  input: Partial<CreateSubjectInput>
): Promise<ActionResult<Subject>> {
  try {
    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.icon !== undefined) updateData.icon = input.icon;

    const { data, error } = await supabase
      .from('subjects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/subjects');
    return { success: true, data: formatResponse(data) as Subject };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update subject' };
  }
}

export async function deleteSubject(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from('subjects').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/subjects');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete subject' };
  }
}

// ============ COURSE-SUBJECT LINKING ============

export async function linkSubjectToCourse(
  courseId: string,
  subjectId: string,
  displayOrder?: number
): Promise<ActionResult<CourseSubject>> {
  try {
    const supabase = createAdminClient();

    let order = displayOrder;
    if (order === undefined) {
      const { data: existing } = await supabase
        .from('course_subjects')
        .select('display_order')
        .eq('course_id', courseId)
        .order('display_order', { ascending: false })
        .limit(1);

      order = existing?.length ? existing[0].display_order + 1 : 1;
    }

    const { data, error } = await supabase
      .from('course_subjects')
      .upsert(
        {
          course_id: courseId,
          subject_id: subjectId,
          display_order: order,
        },
        { onConflict: 'course_id,subject_id' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: formatResponse(data) as CourseSubject };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to link subject to course' };
  }
}

export async function unlinkSubjectFromCourse(courseId: string, subjectId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('course_subjects')
      .delete()
      .eq('course_id', courseId)
      .eq('subject_id', subjectId);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to unlink subject from course' };
  }
}

export async function reorderCourseSubjects(
  courseId: string,
  subjectIds: string[]
): Promise<ActionResult<CourseSubject[]>> {
  try {
    const supabase = createAdminClient();

    const updates = subjectIds.map((subjectId, index) =>
      supabase
        .from('course_subjects')
        .update({ display_order: index + 1 })
        .eq('course_id', courseId)
        .eq('subject_id', subjectId)
    );

    await Promise.all(updates);

    const { data, error } = await supabase
      .from('course_subjects')
      .select('*')
      .eq('course_id', courseId)
      .order('display_order');

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: formatResponseArray(data || []) as CourseSubject[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder subjects' };
  }
}

// ============ TOPIC QUERIES ============

export async function getTopics(subjectId: string): Promise<ActionResult<Topic[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('subject_id', subjectId)
      .order('name');

    if (error) throw new Error(error.message);

    // Add questions count
    const topicsWithCounts = await Promise.all(
      (data || []).map(async (topic) => {
        const questionsCount = await getTopicQuestionsCount(topic.id);
        return { ...formatResponse(topic), questionsCount };
      })
    );

    return { success: true, data: topicsWithCounts as Topic[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch topics' };
  }
}

// ============ TOPIC MUTATIONS ============

export async function createTopic(input: CreateTopicInput): Promise<ActionResult<Topic>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('topics')
      .insert({
        subject_id: input.subjectId,
        name: input.name,
        description: input.description,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/subjects');
    return { success: true, data: formatResponse(data) as Topic };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create topic' };
  }
}

export async function updateTopic(
  id: string,
  input: { name?: string; description?: string }
): Promise<ActionResult<Topic>> {
  try {
    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;

    const { data, error } = await supabase
      .from('topics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/subjects');
    return { success: true, data: formatResponse(data) as Topic };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update topic' };
  }
}

export async function deleteTopic(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from('topics').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/subjects');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete topic' };
  }
}

// ============ HELPER FUNCTIONS ============

async function getTopicsCount(subjectId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('topics')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', subjectId);

  return count || 0;
}

async function getSubjectQuestionsCount(subjectId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', subjectId);

  return count || 0;
}

async function getSubjectNotesCount(subjectId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', subjectId)
    .eq('is_published', true);

  return count || 0;
}

async function getTopicQuestionsCount(topicId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('topic_id', topicId);

  return count || 0;
}
