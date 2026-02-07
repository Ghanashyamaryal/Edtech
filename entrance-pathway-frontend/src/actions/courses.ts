'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAuth, requireMentorOrAdmin } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, generateSlug, toSnakeCase, type ActionResult } from './utils';

// Types
export interface CourseInput {
  title: string;
  fullName?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  discountedPrice?: number;
  durationHours?: number;
  features?: string[];
  isBestseller?: boolean;
  isPublished?: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  fullName?: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  discountedPrice?: number;
  durationHours?: number;
  features?: string[];
  isBestseller: boolean;
  isPublished: boolean;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  // Landing page fields
  studentCount?: number;
  rating?: number;
  reviewsCount?: number;
  instructor?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  } | null;
  // Computed fields
  chaptersCount?: number;
  lessonsCount?: number;
  enrollmentsCount?: number;
  examsCount?: number;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  lessons: Lesson[];
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
}

// ============ QUERIES ============

export async function getCourses(options?: {
  limit?: number;
  offset?: number;
  isPublished?: boolean;
}): Promise<ActionResult<Course[]>> {
  try {
    const supabase = createAdminClient();
    const { limit = 10, offset = 0, isPublished } = options || {};

    let query = supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (isPublished !== undefined) {
      query = query.eq('is_published', isPublished);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const courses = formatResponseArray(data || []) as Course[];

    // Fetch counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const [chaptersCount, enrollmentsCount, examsCount] = await Promise.all([
          getChaptersCount(course.id),
          getEnrollmentsCount(course.id),
          getExamsCount(course.id),
        ]);

        return {
          ...course,
          chaptersCount,
          enrollmentsCount,
          examsCount,
        };
      })
    );

    return { success: true, data: coursesWithCounts };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch courses' };
  }
}

export async function getCourse(options: { id?: string; slug?: string }): Promise<ActionResult<Course>> {
  try {
    const supabase = createAdminClient();
    const { id, slug } = options;

    if (!id && !slug) {
      throw new Error('Either id or slug must be provided');
    }

    let query = supabase.from('courses').select('*');

    if (id) {
      query = query.eq('id', id);
    } else if (slug) {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Course not found');
      throw new Error(error.message);
    }

    const course = formatResponse(data) as Course;

    // Fetch counts
    const [chaptersCount, lessonsCount, enrollmentsCount, examsCount] = await Promise.all([
      getChaptersCount(course.id),
      getLessonsCount(course.id),
      getEnrollmentsCount(course.id),
      getExamsCount(course.id),
    ]);

    return {
      success: true,
      data: {
        ...course,
        chaptersCount,
        lessonsCount,
        enrollmentsCount,
        examsCount,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch course' };
  }
}

export async function getCourseWithChapters(courseId: string): Promise<ActionResult<Course & { chapters: any[] }>> {
  try {
    const supabase = createAdminClient();

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError) throw new Error(courseError.message);

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('position');

    if (chaptersError) throw new Error(chaptersError.message);

    const formattedCourse = formatResponse(course) as Course;
    const formattedChapters = formatResponseArray(chapters || []).map((chapter: any) => ({
      ...chapter,
      lessons: formatResponseArray(chapter.lessons || []),
    }));

    return {
      success: true,
      data: {
        ...formattedCourse,
        chapters: formattedChapters,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch course' };
  }
}

export async function getEnrolledCourses(userId: string): Promise<ActionResult<any[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    const enrollments = (data || []).map((enrollment) => ({
      ...formatResponse(enrollment),
      course: formatResponse(enrollment.course),
    }));

    return { success: true, data: enrollments };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch enrolled courses' };
  }
}

// ============ MUTATIONS ============

export async function createCourse(input: CourseInput): Promise<ActionResult<Course>> {
  try {
    const user = await requireMentorOrAdmin();
    const supabase = createAdminClient();

    const slug = generateSlug(input.title);

    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        slug,
        instructor_id: user.id,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/courses');
    return { success: true, data: formatResponse(data) as Course };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create course' };
  }
}

export async function updateCourse(id: string, input: Partial<CourseInput>): Promise<ActionResult<Course>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    // Check ownership or admin
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();

    if (!course) throw new Error('Course not found');
    if (course.instructor_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: You do not have permission to update this course');
    }

    const updateData = toSnakeCase(input) as Record<string, unknown>;
    if (input.title) {
      updateData.slug = generateSlug(input.title);
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${id}`);
    return { success: true, data: formatResponse(data) as Course };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update course' };
  }
}

export async function deleteCourse(id: string): Promise<ActionResult<boolean>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();

    if (!course) throw new Error('Course not found');
    if (course.instructor_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: You do not have permission to delete this course');
    }

    const { error } = await supabase.from('courses').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/courses');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete course' };
  }
}

export async function publishCourse(id: string): Promise<ActionResult<Course>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();

    if (!course) throw new Error('Course not found');
    if (course.instructor_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: You do not have permission to publish this course');
    }

    const { data, error } = await supabase
      .from('courses')
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${id}`);
    return { success: true, data: formatResponse(data) as Course };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to publish course' };
  }
}

export async function enrollInCourse(courseId: string): Promise<ActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      throw new Error('Already enrolled in this course');
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard');
    return { success: true, data: formatResponse(data) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to enroll in course' };
  }
}

// ============ HELPER FUNCTIONS ============

async function getChaptersCount(courseId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('chapters')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);

  return count || 0;
}

async function getLessonsCount(courseId: string): Promise<number> {
  const supabase = createAdminClient();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id')
    .eq('course_id', courseId);

  if (!chapters?.length) return 0;

  const { count } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .in('chapter_id', chapters.map((c) => c.id));

  return count || 0;
}

async function getEnrollmentsCount(courseId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);

  return count || 0;
}

async function getExamsCount(courseId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('course_exams')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);

  return count || 0;
}

// ============ LANDING PAGE QUERIES ============

export async function getPublishedCourses(options?: {
  limit?: number;
}): Promise<ActionResult<Course[]>> {
  try {
    const supabase = createAdminClient();
    const { limit = 10 } = options || {};

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users!instructor_id(id, full_name, avatar_url)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    // Transform data and get counts
    const coursesWithCounts = await Promise.all(
      (data || []).map(async (course) => {
        const [chaptersCount, lessonsCount, enrollmentsCount] = await Promise.all([
          getChaptersCount(course.id),
          getLessonsCount(course.id),
          getEnrollmentsCount(course.id),
        ]);

        return {
          ...formatResponse(course),
          instructor: course.instructor
            ? { id: course.instructor.id, fullName: course.instructor.full_name, avatarUrl: course.instructor.avatar_url }
            : null,
          chaptersCount,
          lessonsCount,
          studentCount: enrollmentsCount,
        };
      })
    );

    return { success: true, data: coursesWithCounts as Course[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch courses' };
  }
}

export async function getCourseBySlug(slug: string): Promise<ActionResult<Course & { chapters: Chapter[] }>> {
  try {
    const supabase = createAdminClient();

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users!instructor_id(id, full_name, avatar_url)
      `)
      .eq('slug', slug)
      .single();

    if (courseError) {
      if (courseError.code === 'PGRST116') throw new Error('Course not found');
      throw new Error(courseError.message);
    }

    // Get chapters with lessons
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*, lessons(*)')
      .eq('course_id', course.id)
      .order('position');

    if (chaptersError) throw new Error(chaptersError.message);

    // Get counts
    const enrollmentsCount = await getEnrollmentsCount(course.id);

    const formattedCourse = {
      ...formatResponse(course),
      instructor: course.instructor
        ? { id: course.instructor.id, fullName: course.instructor.full_name, avatarUrl: course.instructor.avatar_url }
        : null,
      studentCount: enrollmentsCount,
    };

    const formattedChapters = formatResponseArray(chapters || []).map((chapter: any) => ({
      ...chapter,
      lessons: formatResponseArray(chapter.lessons || []).sort((a: any, b: any) => a.position - b.position),
    })).sort((a: any, b: any) => a.position - b.position);

    return {
      success: true,
      data: {
        ...formattedCourse,
        chapters: formattedChapters,
      } as Course & { chapters: Chapter[] },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch course' };
  }
}
