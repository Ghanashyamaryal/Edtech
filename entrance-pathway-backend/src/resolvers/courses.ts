import { supabaseAdmin } from '../config';
import { Context, PaginationArgs } from './types';
import {
  formatResponse,
  formatResponseArray,
  generateSlug,
  toSnakeCase,
} from '../utils/helpers';
import { AuthenticationError, ForbiddenError, NotFoundError, DatabaseError } from '../utils/errors';

export const courseResolvers = {
  Query: {
    courses: async (
      _: any,
      { limit = 10, offset = 0, isPublished }: PaginationArgs & { isPublished?: boolean }
    ) => {
      let query = supabaseAdmin
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (isPublished !== undefined) {
        query = query.eq('is_published', isPublished);
      }

      const { data, error } = await query;

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    course: async (_: any, { id, slug }: { id?: string; slug?: string }) => {
      if (!id && !slug) {
        throw new Error('Either id or slug must be provided');
      }

      let query = supabaseAdmin.from('courses').select('*');

      if (id) {
        query = query.eq('id', id);
      } else if (slug) {
        query = query.eq('slug', slug);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Course');
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },

    enrolledCourses: async (_: any, { userId }: { userId: string }, context: Context) => {
      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .select('*, course:courses(*)')
        .eq('user_id', userId);

      if (error) throw new DatabaseError(error.message);

      return (data || []).map((enrollment) => ({
        ...formatResponse(enrollment),
        course: formatResponse(enrollment.course),
      }));
    },
  },

  Mutation: {
    createCourse: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'instructor' && context.user.role !== 'admin') {
        throw new ForbiddenError('Only instructors can create courses');
      }

      const slug = generateSlug(input.title);

      const { data, error } = await supabaseAdmin
        .from('courses')
        .insert({
          ...toSnakeCase(input),
          slug,
          instructor_id: context.user.id,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    updateCourse: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();

      // Check ownership or admin
      const { data: course } = await supabaseAdmin
        .from('courses')
        .select('instructor_id')
        .eq('id', id)
        .single();

      if (!course) throw new NotFoundError('Course');
      if (course.instructor_id !== context.user.id && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const updateData = toSnakeCase(input);
      if (input.title) {
        updateData.slug = generateSlug(input.title);
      }

      const { data, error } = await supabaseAdmin
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    deleteCourse: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();

      const { data: course } = await supabaseAdmin
        .from('courses')
        .select('instructor_id')
        .eq('id', id)
        .single();

      if (!course) throw new NotFoundError('Course');
      if (course.instructor_id !== context.user.id && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);

      if (error) throw new DatabaseError(error.message);
      return true;
    },

    enrollInCourse: async (_: any, { courseId }: { courseId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();

      // Check if already enrolled
      const { data: existing } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', context.user.id)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        throw new Error('Already enrolled in this course');
      }

      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .insert({
          user_id: context.user.id,
          course_id: courseId,
          progress: 0,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    updateLessonProgress: async (
      _: any,
      {
        lessonId,
        watchedDuration,
        isCompleted,
      }: { lessonId: string; watchedDuration: number; isCompleted?: boolean },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();

      const { data: existing } = await supabaseAdmin
        .from('lesson_progress')
        .select('*')
        .eq('user_id', context.user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        const { data, error } = await supabaseAdmin
          .from('lesson_progress')
          .update({
            watched_duration: watchedDuration,
            is_completed: isCompleted ?? existing.is_completed,
            completed_at: isCompleted ? new Date().toISOString() : existing.completed_at,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw new DatabaseError(error.message);
        return formatResponse(data);
      }

      const { data, error } = await supabaseAdmin
        .from('lesson_progress')
        .insert({
          user_id: context.user.id,
          lesson_id: lessonId,
          watched_duration: watchedDuration,
          is_completed: isCompleted ?? false,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },
  },

  Course: {
    instructor: async (course: any) => {
      const { data } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', course.instructorId)
        .single();

      return formatResponse(data);
    },

    chapters: async (course: any) => {
      const { data } = await supabaseAdmin
        .from('chapters')
        .select('*')
        .eq('course_id', course.id)
        .order('position');

      return formatResponseArray(data || []);
    },

    chaptersCount: async (course: any) => {
      const { count } = await supabaseAdmin
        .from('chapters')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.id);

      return count || 0;
    },

    lessonsCount: async (course: any) => {
      const { data: chapters } = await supabaseAdmin
        .from('chapters')
        .select('id')
        .eq('course_id', course.id);

      if (!chapters?.length) return 0;

      const { count } = await supabaseAdmin
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .in(
          'chapter_id',
          chapters.map((c) => c.id)
        );

      return count || 0;
    },

    enrollmentsCount: async (course: any) => {
      const { count } = await supabaseAdmin
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.id);

      return count || 0;
    },

    exams: async (course: any) => {
      const { data } = await supabaseAdmin
        .from('course_exams')
        .select('exam:exams(*)')
        .eq('course_id', course.id)
        .order('display_order');

      return (data || [])
        .map((ce: any) => ce.exam)
        .filter((e: any) => e !== null)
        .map((e: any) => formatResponse(e));
    },

    examsCount: async (course: any) => {
      const { count } = await supabaseAdmin
        .from('course_exams')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.id);

      return count || 0;
    },
  },

  Chapter: {
    lessons: async (chapter: any) => {
      const { data } = await supabaseAdmin
        .from('lessons')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('position');

      return formatResponseArray(data || []);
    },
  },

  Enrollment: {
    course: async (enrollment: any) => {
      const { data } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', enrollment.courseId)
        .single();

      return formatResponse(data);
    },
  },
};
