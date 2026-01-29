import { supabaseAdmin } from '../config';
import { Context, PaginationArgs } from './types';
import { formatResponse, formatResponseArray, toSnakeCase } from '../utils/helpers';
import { AuthenticationError, ForbiddenError, NotFoundError, DatabaseError } from '../utils/errors';

export const questionResolvers = {
  Query: {
    subjects: async () => {
      const { data, error } = await supabaseAdmin
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    subject: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabaseAdmin
        .from('subjects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Subject');
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },

    topics: async (_: any, { subjectId }: { subjectId: string }) => {
      const { data, error } = await supabaseAdmin
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .order('name');

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    questions: async (
      _: any,
      {
        subjectId,
        topicId,
        difficulty,
        limit = 20,
        offset = 0,
      }: PaginationArgs & {
        subjectId?: string;
        topicId?: string;
        difficulty?: string;
      }
    ) => {
      let query = supabaseAdmin
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (subjectId) query = query.eq('subject_id', subjectId);
      if (topicId) query = query.eq('topic_id', topicId);
      if (difficulty) query = query.eq('difficulty', difficulty);

      const { data, error } = await query;

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    question: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabaseAdmin
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Question');
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },
  },

  Mutation: {
    // Subject mutations
    createSubject: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can create subjects');
      }

      const { data, error } = await supabaseAdmin
        .from('subjects')
        .insert({
          name: input.name,
          description: input.description,
          icon: input.icon,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    updateSubject: async (
      _: any,
      { id, name, description, icon }: { id: string; name?: string; description?: string; icon?: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can update subjects');
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (icon !== undefined) updateData.icon = icon;

      const { data, error } = await supabaseAdmin
        .from('subjects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Subject');
        throw new DatabaseError(error.message);
      }
      return formatResponse(data);
    },

    deleteSubject: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can delete subjects');
      }

      const { error } = await supabaseAdmin.from('subjects').delete().eq('id', id);
      if (error) throw new DatabaseError(error.message);
      return true;
    },

    // Topic mutations
    createTopic: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can create topics');
      }

      const { data, error } = await supabaseAdmin
        .from('topics')
        .insert({
          subject_id: input.subjectId,
          name: input.name,
          description: input.description,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    updateTopic: async (
      _: any,
      { id, name, description }: { id: string; name?: string; description?: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can update topics');
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      const { data, error } = await supabaseAdmin
        .from('topics')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Topic');
        throw new DatabaseError(error.message);
      }
      return formatResponse(data);
    },

    deleteTopic: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can delete topics');
      }

      const { error } = await supabaseAdmin.from('topics').delete().eq('id', id);
      if (error) throw new DatabaseError(error.message);
      return true;
    },

    // Question mutations
    createQuestion: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'instructor' && context.user.role !== 'admin') {
        throw new ForbiddenError('Only instructors can create questions');
      }

      // Determine correct answer from options
      const correctOption = input.options.find((opt: any) => opt.isCorrect);
      const correctAnswer = correctOption?.text || '';

      const { data, error } = await supabaseAdmin
        .from('questions')
        .insert({
          question_text: input.questionText,
          question_type: input.questionType,
          options: input.options,
          correct_answer: correctAnswer,
          explanation: input.explanation,
          difficulty: input.difficulty,
          subject_id: input.subjectId,
          topic_id: input.topicId,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    updateQuestion: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'instructor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const correctOption = input.options.find((opt: any) => opt.isCorrect);
      const correctAnswer = correctOption?.text || '';

      const { data, error } = await supabaseAdmin
        .from('questions')
        .update({
          question_text: input.questionText,
          question_type: input.questionType,
          options: input.options,
          correct_answer: correctAnswer,
          explanation: input.explanation,
          difficulty: input.difficulty,
          subject_id: input.subjectId,
          topic_id: input.topicId,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    deleteQuestion: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'instructor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { error } = await supabaseAdmin.from('questions').delete().eq('id', id);

      if (error) throw new DatabaseError(error.message);
      return true;
    },
  },

  Subject: {
    topics: async (subject: any) => {
      const { data } = await supabaseAdmin
        .from('topics')
        .select('*')
        .eq('subject_id', subject.id)
        .order('name');

      return formatResponseArray(data || []);
    },

    topicsCount: async (subject: any) => {
      const { count } = await supabaseAdmin
        .from('topics')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subject.id);

      return count || 0;
    },

    questionsCount: async (subject: any) => {
      const { count } = await supabaseAdmin
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subject.id);

      return count || 0;
    },
  },

  Topic: {
    questionsCount: async (topic: any) => {
      const { count } = await supabaseAdmin
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('topic_id', topic.id);

      return count || 0;
    },
  },

  Question: {
    subject: async (question: any) => {
      const { data } = await supabaseAdmin
        .from('subjects')
        .select('*')
        .eq('id', question.subjectId)
        .single();

      return formatResponse(data);
    },

    topic: async (question: any) => {
      if (!question.topicId) return null;

      const { data } = await supabaseAdmin
        .from('topics')
        .select('*')
        .eq('id', question.topicId)
        .single();

      return formatResponse(data);
    },
  },
};
