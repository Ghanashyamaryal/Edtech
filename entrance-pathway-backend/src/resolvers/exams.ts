import { supabaseAdmin } from '../config';
import { Context, PaginationArgs } from './types';
import { formatResponse, formatResponseArray, toSnakeCase } from '../utils/helpers';
import { AuthenticationError, ForbiddenError, NotFoundError, DatabaseError } from '../utils/errors';

export const examResolvers = {
  Query: {
    exams: async (
      _: any,
      { isPublished, limit = 10, offset = 0 }: PaginationArgs & { isPublished?: boolean }
    ) => {
      let query = supabaseAdmin
        .from('exams')
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

    exam: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabaseAdmin
        .from('exams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Exam');
        throw new DatabaseError(error.message);
      }

      return formatResponse(data);
    },

    examAttempt: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();

      const { data, error } = await supabaseAdmin
        .from('exam_attempts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError('Exam attempt');
        throw new DatabaseError(error.message);
      }

      // Users can only view their own attempts unless admin
      if (data.user_id !== context.user.id && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      return formatResponse(data);
    },

    userExamAttempts: async (
      _: any,
      { userId, examId }: { userId: string; examId?: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();

      // Users can only view their own attempts unless admin
      if (userId !== context.user.id && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      let query = supabaseAdmin
        .from('exam_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (examId) {
        query = query.eq('exam_id', examId);
      }

      const { data, error } = await query;

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },
  },

  Mutation: {
    createExam: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'instructor' && context.user.role !== 'admin') {
        throw new ForbiddenError('Only instructors can create exams');
      }

      const { data, error } = await supabaseAdmin
        .from('exams')
        .insert({
          ...toSnakeCase(input),
          is_published: false,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    addQuestionToExam: async (
      _: any,
      { examId, questionId, marks }: { examId: string; questionId: string; marks: number },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'instructor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      // Get current max position
      const { data: existing } = await supabaseAdmin
        .from('exam_questions')
        .select('position')
        .eq('exam_id', examId)
        .order('position', { ascending: false })
        .limit(1);

      const position = existing?.length ? existing[0].position + 1 : 1;

      const { data, error } = await supabaseAdmin
        .from('exam_questions')
        .insert({
          exam_id: examId,
          question_id: questionId,
          marks,
          position,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    startExamAttempt: async (_: any, { examId }: { examId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();

      // Check if there's an incomplete attempt
      const { data: existingAttempt } = await supabaseAdmin
        .from('exam_attempts')
        .select('*')
        .eq('user_id', context.user.id)
        .eq('exam_id', examId)
        .is('completed_at', null)
        .single();

      if (existingAttempt) {
        return formatResponse(existingAttempt);
      }

      const { data, error } = await supabaseAdmin
        .from('exam_attempts')
        .insert({
          user_id: context.user.id,
          exam_id: examId,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    submitExamAnswer: async (
      _: any,
      {
        attemptId,
        questionId,
        selectedAnswer,
      }: { attemptId: string; questionId: string; selectedAnswer: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();

      // Verify attempt belongs to user
      const { data: attempt } = await supabaseAdmin
        .from('exam_attempts')
        .select('*')
        .eq('id', attemptId)
        .eq('user_id', context.user.id)
        .is('completed_at', null)
        .single();

      if (!attempt) {
        throw new ForbiddenError('Invalid or completed attempt');
      }

      // Get correct answer
      const { data: question } = await supabaseAdmin
        .from('questions')
        .select('correct_answer')
        .eq('id', questionId)
        .single();

      const isCorrect = question?.correct_answer === selectedAnswer;

      // Upsert answer
      const { data: existingAnswer } = await supabaseAdmin
        .from('exam_answers')
        .select('id')
        .eq('attempt_id', attemptId)
        .eq('question_id', questionId)
        .single();

      if (existingAnswer) {
        const { data, error } = await supabaseAdmin
          .from('exam_answers')
          .update({
            selected_answer: selectedAnswer,
            is_correct: isCorrect,
          })
          .eq('id', existingAnswer.id)
          .select()
          .single();

        if (error) throw new DatabaseError(error.message);
        return formatResponse(data);
      }

      const { data, error } = await supabaseAdmin
        .from('exam_answers')
        .insert({
          attempt_id: attemptId,
          question_id: questionId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    completeExamAttempt: async (_: any, { attemptId }: { attemptId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();

      // Verify attempt belongs to user
      const { data: attempt } = await supabaseAdmin
        .from('exam_attempts')
        .select('*, exam:exams(*)')
        .eq('id', attemptId)
        .eq('user_id', context.user.id)
        .single();

      if (!attempt) throw new NotFoundError('Exam attempt');
      if (attempt.completed_at) {
        throw new Error('Attempt already completed');
      }

      // Calculate score
      const { data: answers } = await supabaseAdmin
        .from('exam_answers')
        .select('*, exam_question:exam_questions!inner(*)')
        .eq('attempt_id', attemptId);

      let score = 0;
      if (answers) {
        for (const answer of answers) {
          if (answer.is_correct) {
            // Get marks for this question
            const { data: eq } = await supabaseAdmin
              .from('exam_questions')
              .select('marks')
              .eq('exam_id', attempt.exam_id)
              .eq('question_id', answer.question_id)
              .single();

            if (eq) score += eq.marks;
          }
        }
      }

      const { data, error } = await supabaseAdmin
        .from('exam_attempts')
        .update({
          completed_at: new Date().toISOString(),
          score,
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },
  },

  Exam: {
    questions: async (exam: any) => {
      const { data } = await supabaseAdmin
        .from('exam_questions')
        .select('*')
        .eq('exam_id', exam.id)
        .order('position');

      return formatResponseArray(data || []);
    },

    questionsCount: async (exam: any) => {
      const { count } = await supabaseAdmin
        .from('exam_questions')
        .select('*', { count: 'exact', head: true })
        .eq('exam_id', exam.id);

      return count || 0;
    },
  },

  ExamQuestion: {
    question: async (examQuestion: any) => {
      const { data } = await supabaseAdmin
        .from('questions')
        .select('*')
        .eq('id', examQuestion.questionId)
        .single();

      return formatResponse(data);
    },
  },

  ExamAttempt: {
    exam: async (attempt: any) => {
      const { data } = await supabaseAdmin
        .from('exams')
        .select('*')
        .eq('id', attempt.examId)
        .single();

      return formatResponse(data);
    },

    answers: async (attempt: any) => {
      const { data } = await supabaseAdmin
        .from('exam_answers')
        .select('*')
        .eq('attempt_id', attempt.id);

      return formatResponseArray(data || []);
    },
  },
};
