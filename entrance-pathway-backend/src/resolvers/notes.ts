import { supabaseAdmin } from '../config';
import { Context, PaginationArgs } from './types';
import { formatResponse, formatResponseArray, toSnakeCase } from '../utils/helpers';
import { AuthenticationError, ForbiddenError, NotFoundError, DatabaseError } from '../utils/errors';

export interface NotesQueryArgs extends PaginationArgs {
  subjectId?: string;
  topicId?: string;
  noteType?: string;
  isPublished?: boolean;
  isPremium?: boolean;
}

export interface CreateNoteInput {
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  noteType: string;
  subjectId: string;
  topicId?: string;
  year?: number;
  isPremium?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  noteType?: string;
  subjectId?: string;
  topicId?: string;
  year?: number;
  isPremium?: boolean;
  isPublished?: boolean;
}

export const notesResolvers = {
  Query: {
    notes: async (
      _: any,
      {
        subjectId,
        topicId,
        noteType,
        isPublished,
        isPremium,
        limit = 20,
        offset = 0,
      }: NotesQueryArgs
    ) => {
      let query = supabaseAdmin
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      if (topicId) {
        query = query.eq('topic_id', topicId);
      }
      if (noteType) {
        query = query.eq('note_type', noteType);
      }
      if (isPublished !== undefined) {
        query = query.eq('is_published', isPublished);
      }
      if (isPremium !== undefined) {
        query = query.eq('is_premium', isPremium);
      }

      const { data, error } = await query;

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    note: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Note');
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },

    notesBySubject: async (_: any, { subjectId }: { subjectId: string }) => {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    courseSubjects: async (_: any, { courseId }: { courseId: string }) => {
      const { data, error } = await supabaseAdmin
        .from('course_subjects')
        .select('*')
        .eq('course_id', courseId)
        .order('display_order');

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },
  },

  Mutation: {
    createNote: async (_: any, { input }: { input: CreateNoteInput }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError('Only mentors and admins can create notes');
      }

      const { data, error } = await supabaseAdmin
        .from('notes')
        .insert({
          ...toSnakeCase(input),
          uploaded_by: context.user.id,
          is_published: false,
          download_count: 0,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    updateNote: async (
      _: any,
      { id, input }: { id: string; input: UpdateNoteInput },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      // Check if user owns the note or is admin
      if (context.user.role !== 'admin') {
        const { data: existingNote } = await supabaseAdmin
          .from('notes')
          .select('uploaded_by')
          .eq('id', id)
          .single();

        if (existingNote?.uploaded_by !== context.user.id) {
          throw new ForbiddenError('You can only edit your own notes');
        }
      }

      const { data, error } = await supabaseAdmin
        .from('notes')
        .update(toSnakeCase(input))
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    deleteNote: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can delete notes');
      }

      const { error } = await supabaseAdmin.from('notes').delete().eq('id', id);

      if (error) throw new DatabaseError(error.message);
      return true;
    },

    publishNote: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { data, error } = await supabaseAdmin
        .from('notes')
        .update({ is_published: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    incrementNoteDownload: async (_: any, { id }: { id: string }) => {
      // First get current count
      const { data: note } = await supabaseAdmin
        .from('notes')
        .select('download_count')
        .eq('id', id)
        .single();

      const newCount = (note?.download_count || 0) + 1;

      const { data, error } = await supabaseAdmin
        .from('notes')
        .update({ download_count: newCount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    // Course-Subject linking
    linkSubjectToCourse: async (
      _: any,
      {
        courseId,
        subjectId,
        displayOrder,
      }: { courseId: string; subjectId: string; displayOrder?: number },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can link subjects to courses');
      }

      // Get max display order if not provided
      let order = displayOrder;
      if (order === undefined) {
        const { data: existing } = await supabaseAdmin
          .from('course_subjects')
          .select('display_order')
          .eq('course_id', courseId)
          .order('display_order', { ascending: false })
          .limit(1);

        order = existing?.length ? existing[0].display_order + 1 : 1;
      }

      const { data, error } = await supabaseAdmin
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

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    unlinkSubjectFromCourse: async (
      _: any,
      { courseId, subjectId }: { courseId: string; subjectId: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { error } = await supabaseAdmin
        .from('course_subjects')
        .delete()
        .eq('course_id', courseId)
        .eq('subject_id', subjectId);

      if (error) throw new DatabaseError(error.message);
      return true;
    },

    reorderCourseSubjects: async (
      _: any,
      { courseId, subjectIds }: { courseId: string; subjectIds: string[] },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      // Update each subject's display order
      const updates = subjectIds.map((subjectId, index) =>
        supabaseAdmin
          .from('course_subjects')
          .update({ display_order: index + 1 })
          .eq('course_id', courseId)
          .eq('subject_id', subjectId)
      );

      await Promise.all(updates);

      // Fetch updated list
      const { data, error } = await supabaseAdmin
        .from('course_subjects')
        .select('*')
        .eq('course_id', courseId)
        .order('display_order');

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },
  },

  // Field resolvers
  Note: {
    subject: async (note: any) => {
      const { data } = await supabaseAdmin
        .from('subjects')
        .select('*')
        .eq('id', note.subjectId)
        .single();

      return formatResponse(data);
    },

    topic: async (note: any) => {
      if (!note.topicId) return null;

      const { data } = await supabaseAdmin
        .from('topics')
        .select('*')
        .eq('id', note.topicId)
        .single();

      return formatResponse(data);
    },

    uploader: async (note: any) => {
      const { data } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', note.uploadedBy)
        .single();

      return formatResponse(data);
    },
  },

  Subject: {
    notesCount: async (subject: any) => {
      const { count } = await supabaseAdmin
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subject.id)
        .eq('is_published', true);

      return count || 0;
    },

    notes: async (subject: any) => {
      const { data } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('subject_id', subject.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      return formatResponseArray(data || []);
    },
  },

  CourseSubject: {
    course: async (courseSubject: any) => {
      const { data } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', courseSubject.courseId)
        .single();

      return formatResponse(data);
    },

    subject: async (courseSubject: any) => {
      const { data } = await supabaseAdmin
        .from('subjects')
        .select('*')
        .eq('id', courseSubject.subjectId)
        .single();

      return formatResponse(data);
    },
  },
};
