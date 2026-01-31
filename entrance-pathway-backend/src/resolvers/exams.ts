import { supabaseAdmin } from '../config';
import { Context, PaginationArgs } from './types';
import { formatResponse, formatResponseArray, toSnakeCase } from '../utils/helpers';
import { AuthenticationError, ForbiddenError, NotFoundError, DatabaseError } from '../utils/errors';

export const examResolvers = {
  Query: {
    exams: async (
      _: any,
      {
        isPublished,
        courseId,
        examType,
        limit = 10,
        offset = 0,
      }: PaginationArgs & { isPublished?: boolean; courseId?: string; examType?: string }
    ) => {
      // If filtering by courseId, we need to join with course_exams
      if (courseId) {
        let query = supabaseAdmin
          .from('course_exams')
          .select('exam:exams(*)')
          .eq('course_id', courseId)
          .order('display_order');

        const { data, error } = await query;

        if (error) throw new DatabaseError(error.message);

        // Extract exams from the join and filter
        let exams = (data || [])
          .map((ce: any) => ce.exam)
          .filter((exam: any) => exam !== null);

        // Apply additional filters
        if (isPublished !== undefined) {
          exams = exams.filter((e: any) => e.is_published === isPublished);
        }
        if (examType) {
          exams = exams.filter((e: any) => e.exam_type === examType);
        }

        return formatResponseArray(exams);
      }

      // Standard query without courseId filter
      let query = supabaseAdmin
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (isPublished !== undefined) {
        query = query.eq('is_published', isPublished);
      }

      if (examType) {
        query = query.eq('exam_type', examType);
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

    courseExams: async (_: any, { courseId }: { courseId: string }) => {
      const { data, error } = await supabaseAdmin
        .from('course_exams')
        .select('*')
        .eq('course_id', courseId)
        .order('display_order');

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
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
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError('Only mentors can create exams');
      }

      const { courseId, ...examInput } = input;

      const { data, error } = await supabaseAdmin
        .from('exams')
        .insert({
          ...toSnakeCase(examInput),
          is_published: false,
        })
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);

      // If courseId is provided, link the exam to the course
      if (courseId && data) {
        // Get max display order
        const { data: existing } = await supabaseAdmin
          .from('course_exams')
          .select('display_order')
          .eq('course_id', courseId)
          .order('display_order', { ascending: false })
          .limit(1);

        const displayOrder = existing?.length ? existing[0].display_order + 1 : 1;

        await supabaseAdmin.from('course_exams').insert({
          course_id: courseId,
          exam_id: data.id,
          display_order: displayOrder,
          is_required: false,
        });
      }

      return formatResponse(data);
    },

    updateExam: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { courseId, ...examInput } = input;

      const { data, error } = await supabaseAdmin
        .from('exams')
        .update(toSnakeCase(examInput))
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    deleteExam: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { error } = await supabaseAdmin.from('exams').delete().eq('id', id);

      if (error) throw new DatabaseError(error.message);
      return true;
    },

    linkExamToCourse: async (
      _: any,
      {
        examId,
        courseId,
        displayOrder,
        isRequired,
      }: { examId: string; courseId: string; displayOrder?: number; isRequired?: boolean },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      // Get max display order if not provided
      let order = displayOrder;
      if (order === undefined) {
        const { data: existing } = await supabaseAdmin
          .from('course_exams')
          .select('display_order')
          .eq('course_id', courseId)
          .order('display_order', { ascending: false })
          .limit(1);

        order = existing?.length ? existing[0].display_order + 1 : 1;
      }

      const { data, error } = await supabaseAdmin
        .from('course_exams')
        .upsert(
          {
            course_id: courseId,
            exam_id: examId,
            display_order: order,
            is_required: isRequired ?? false,
          },
          { onConflict: 'course_id,exam_id' }
        )
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return formatResponse(data);
    },

    unlinkExamFromCourse: async (
      _: any,
      { examId, courseId }: { examId: string; courseId: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { error } = await supabaseAdmin
        .from('course_exams')
        .delete()
        .eq('course_id', courseId)
        .eq('exam_id', examId);

      if (error) throw new DatabaseError(error.message);
      return true;
    },

    reorderCourseExams: async (
      _: any,
      { courseId, examIds }: { courseId: string; examIds: string[] },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      // Update each exam's display order
      const updates = examIds.map((examId, index) =>
        supabaseAdmin
          .from('course_exams')
          .update({ display_order: index + 1 })
          .eq('course_id', courseId)
          .eq('exam_id', examId)
      );

      await Promise.all(updates);

      // Fetch updated list
      const { data, error } = await supabaseAdmin
        .from('course_exams')
        .select('*')
        .eq('course_id', courseId)
        .order('display_order');

      if (error) throw new DatabaseError(error.message);
      return formatResponseArray(data || []);
    },

    addQuestionToExam: async (
      _: any,
      { examId, questionId, marks }: { examId: string; questionId: string; marks: number },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
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

    removeQuestionFromExam: async (
      _: any,
      { examId, questionId }: { examId: string; questionId: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError();
      if (context.user.role !== 'mentor' && context.user.role !== 'admin') {
        throw new ForbiddenError();
      }

      const { error } = await supabaseAdmin
        .from('exam_questions')
        .delete()
        .eq('exam_id', examId)
        .eq('question_id', questionId);

      if (error) throw new DatabaseError(error.message);
      return true;
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

    courses: async (exam: any) => {
      const { data } = await supabaseAdmin
        .from('course_exams')
        .select('course:courses(*)')
        .eq('exam_id', exam.id);

      return (data || [])
        .map((ce: any) => ce.course)
        .filter((c: any) => c !== null)
        .map((c: any) => formatResponse(c));
    },
  },

  CourseExam: {
    course: async (courseExam: any) => {
      const { data } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', courseExam.courseId)
        .single();

      return formatResponse(data);
    },

    exam: async (courseExam: any) => {
      const { data } = await supabaseAdmin
        .from('exams')
        .select('*')
        .eq('id', courseExam.examId)
        .single();

      return formatResponse(data);
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
