'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAuth } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, toSnakeCase, type ActionResult } from './utils';

// Types
export interface Exam {
  id: string;
  title: string;
  description?: string;
  examType?: string;
  setNumber?: number;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  createdAt: string;
  questionsCount?: number;
  coursesCount?: number;
  courses?: { id: string; title: string; slug?: string }[];
}

export interface CourseExam {
  id: string;
  courseId: string;
  examId: string;
  displayOrder: number;
  isRequired: boolean;
  exam?: Exam;
}

export interface ExamInput {
  title: string;
  description?: string;
  examType?: string;
  setNumber?: number;
  durationMinutes?: number;
  totalMarks?: number;
  passingMarks?: number;
  courseId?: string;
  isPublished?: boolean;
}

// ============ QUERIES ============

export async function getExams(options?: {
  limit?: number;
  offset?: number;
  isPublished?: boolean;
  courseId?: string;
  examType?: string;
}): Promise<ActionResult<Exam[]>> {
  try {
    const supabase = createAdminClient();
    const { limit = 10, offset = 0, isPublished, courseId, examType } = options || {};

    if (courseId) {
      const { data, error } = await supabase
        .from('course_exams')
        .select('exam:exams(*)')
        .eq('course_id', courseId)
        .order('display_order');

      if (error) throw new Error(error.message);

      let exams = (data || [])
        .map((ce: any) => ce.exam)
        .filter((exam: any) => exam !== null);

      if (isPublished !== undefined) {
        exams = exams.filter((e: any) => e.is_published === isPublished);
      }
      if (examType) {
        exams = exams.filter((e: any) => e.exam_type === examType);
      }

      return { success: true, data: formatResponseArray(exams) as Exam[] };
    }

    let query = supabase
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

    if (error) throw new Error(error.message);

    // Add questions count and courses count
    const examsWithCounts = await Promise.all(
      (data || []).map(async (exam) => {
        const [{ count: questionsCount }, { count: coursesCount }] = await Promise.all([
          supabase
            .from('exam_questions')
            .select('*', { count: 'exact', head: true })
            .eq('exam_id', exam.id),
          supabase
            .from('course_exams')
            .select('*', { count: 'exact', head: true })
            .eq('exam_id', exam.id),
        ]);

        return {
          ...formatResponse(exam),
          questionsCount: questionsCount || 0,
          coursesCount: coursesCount || 0,
        };
      })
    );

    return { success: true, data: examsWithCounts as Exam[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch exams' };
  }
}

export async function getExam(id: string): Promise<ActionResult<Exam>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Exam not found');
      throw new Error(error.message);
    }

    const { count } = await supabase
      .from('exam_questions')
      .select('*', { count: 'exact', head: true })
      .eq('exam_id', id);

    return {
      success: true,
      data: { ...formatResponse(data), questionsCount: count || 0 } as Exam,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch exam' };
  }
}

export async function getExamWithCourses(id: string): Promise<ActionResult<Exam>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Exam not found');
      throw new Error(error.message);
    }

    // Get questions count
    const { count } = await supabase
      .from('exam_questions')
      .select('*', { count: 'exact', head: true })
      .eq('exam_id', id);

    // Get linked courses
    const { data: courseExams } = await supabase
      .from('course_exams')
      .select('course:courses(id, title, slug)')
      .eq('exam_id', id);

    const courses = (courseExams || [])
      .map((ce: any) => ce.course)
      .filter((c: any) => c !== null);

    return {
      success: true,
      data: {
        ...formatResponse(data),
        questionsCount: count || 0,
        courses,
      } as Exam,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch exam' };
  }
}

export async function getExamWithQuestions(id: string): Promise<ActionResult<any>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Exam not found');
      throw new Error(error.message);
    }

    // Get exam questions with question details
    const { data: examQuestions } = await supabase
      .from('exam_questions')
      .select('*, question:questions(*)')
      .eq('exam_id', id)
      .order('position');

    return {
      success: true,
      data: {
        ...formatResponse(data),
        questionsCount: examQuestions?.length || 0,
        questions: (examQuestions || []).map((eq: any) => ({
          ...formatResponse(eq),
          question: eq.question ? formatResponse(eq.question) : null,
        })),
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch exam' };
  }
}

export async function getCourseExams(courseId: string): Promise<ActionResult<CourseExam[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('course_exams')
      .select('*, exam:exams(*)')
      .eq('course_id', courseId)
      .order('display_order');

    if (error) throw new Error(error.message);

    const courseExams = (data || []).map((ce) => ({
      ...formatResponse(ce),
      exam: ce.exam ? formatResponse(ce.exam) : null,
    })) as unknown as CourseExam[];

    return { success: true, data: courseExams };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch course exams' };
  }
}

// ============ MUTATIONS ============

export async function createExam(input: ExamInput): Promise<ActionResult<Exam>> {
  try {
    const supabase = createAdminClient();

    const { courseId, ...examInput } = input;

    const { data, error } = await supabase
      .from('exams')
      .insert({
        ...toSnakeCase(examInput),
        is_published: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Link to course if courseId provided
    if (courseId && data) {
      const { data: existing } = await supabase
        .from('course_exams')
        .select('display_order')
        .eq('course_id', courseId)
        .order('display_order', { ascending: false })
        .limit(1);

      const displayOrder = existing?.length ? existing[0].display_order + 1 : 1;

      await supabase.from('course_exams').insert({
        course_id: courseId,
        exam_id: data.id,
        display_order: displayOrder,
        is_required: false,
      });
    }

    revalidatePath('/admin/exams');
    return { success: true, data: formatResponse(data) as Exam };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create exam' };
  }
}

export async function updateExam(id: string, input: Partial<ExamInput>): Promise<ActionResult<Exam>> {
  try {
    const supabase = createAdminClient();

    const { courseId, ...examInput } = input;

    const { data, error } = await supabase
      .from('exams')
      .update(toSnakeCase(examInput))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/exams');
    revalidatePath(`/admin/exams/${id}`);
    return { success: true, data: formatResponse(data) as Exam };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update exam' };
  }
}

export async function deleteExam(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from('exams').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/exams');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete exam' };
  }
}

export async function linkExamToCourse(
  examId: string,
  courseId: string,
  options?: { displayOrder?: number; isRequired?: boolean }
): Promise<ActionResult<CourseExam>> {
  try {
    const supabase = createAdminClient();

    let order = options?.displayOrder;
    if (order === undefined) {
      const { data: existing } = await supabase
        .from('course_exams')
        .select('display_order')
        .eq('course_id', courseId)
        .order('display_order', { ascending: false })
        .limit(1);

      order = existing?.length ? existing[0].display_order + 1 : 1;
    }

    const { data, error } = await supabase
      .from('course_exams')
      .upsert(
        {
          course_id: courseId,
          exam_id: examId,
          display_order: order,
          is_required: options?.isRequired ?? false,
        },
        { onConflict: 'course_id,exam_id' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: formatResponse(data) as CourseExam };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to link exam to course' };
  }
}

export async function unlinkExamFromCourse(examId: string, courseId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('course_exams')
      .delete()
      .eq('course_id', courseId)
      .eq('exam_id', examId);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to unlink exam from course' };
  }
}

export async function reorderCourseExams(courseId: string, examIds: string[]): Promise<ActionResult<CourseExam[]>> {
  try {
    const supabase = createAdminClient();

    const updates = examIds.map((examId, index) =>
      supabase
        .from('course_exams')
        .update({ display_order: index + 1 })
        .eq('course_id', courseId)
        .eq('exam_id', examId)
    );

    await Promise.all(updates);

    const { data, error } = await supabase
      .from('course_exams')
      .select('*')
      .eq('course_id', courseId)
      .order('display_order');

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/courses/${courseId}/chapters`);
    return { success: true, data: formatResponseArray(data || []) as CourseExam[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder exams' };
  }
}

// ============ PUBLIC/USER QUERIES ============

export async function getPublishedExams(): Promise<ActionResult<Exam[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Get questions count and linked courses for each exam
    const examsWithData = await Promise.all(
      (data || []).map(async (exam) => {
        const [{ count: questionsCount }, { data: courseExams }] = await Promise.all([
          supabase
            .from('exam_questions')
            .select('*', { count: 'exact', head: true })
            .eq('exam_id', exam.id),
          supabase
            .from('course_exams')
            .select('course:courses(id, title, slug)')
            .eq('exam_id', exam.id),
        ]);

        const courses = (courseExams || [])
          .map((ce: any) => ce.course)
          .filter((c: any) => c !== null);

        return {
          ...formatResponse(exam),
          questionsCount: questionsCount || 0,
          courses,
        };
      })
    );

    return { success: true, data: examsWithData as Exam[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch exams' };
  }
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  exam: {
    id: string;
    title: string;
    description?: string;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    examType?: string;
    questionsCount: number;
  };
}

export async function getUserExamAttempts(userId: string): Promise<ActionResult<ExamAttempt[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('exam_attempts')
      .select(`
        *,
        exam:exams(*)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Get questions count for each exam
    const attemptsWithData = await Promise.all(
      (data || []).map(async (attempt) => {
        const { count } = await supabase
          .from('exam_questions')
          .select('*', { count: 'exact', head: true })
          .eq('exam_id', attempt.exam_id);

        return {
          ...formatResponse(attempt),
          exam: attempt.exam
            ? {
              ...formatResponse(attempt.exam),
              questionsCount: count || 0,
            }
            : null,
        };
      })
    );

    return { success: true, data: attemptsWithData as ExamAttempt[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch exam attempts' };
  }
}

// ============ EXAM QUESTIONS ============

export async function addQuestionToExam(
  examId: string,
  questionId: string,
  marks: number
): Promise<ActionResult<any>> {
  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('exam_questions')
      .select('position')
      .eq('exam_id', examId)
      .order('position', { ascending: false })
      .limit(1);

    const position = existing?.length ? existing[0].position + 1 : 1;

    const { data, error } = await supabase
      .from('exam_questions')
      .insert({
        exam_id: examId,
        question_id: questionId,
        marks,
        position,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, data: formatResponse(data) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add question to exam' };
  }
}

// Bulk add — single round-trip insert. Positions are appended after the
// current max so existing questions keep their order.
export async function addQuestionsToExam(
  examId: string,
  questionIds: string[],
  marks: number
): Promise<ActionResult<{ added: number }>> {
  try {
    if (!questionIds.length) {
      return { success: true, data: { added: 0 } };
    }
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('exam_questions')
      .select('position, question_id')
      .eq('exam_id', examId)
      .order('position', { ascending: false });

    const startPosition = existing?.length ? existing[0].position + 1 : 1;
    const alreadyAdded = new Set((existing || []).map((e) => e.question_id));
    const toInsert = questionIds.filter((id) => !alreadyAdded.has(id));

    if (!toInsert.length) {
      return { success: true, data: { added: 0 } };
    }

    const rows = toInsert.map((questionId, idx) => ({
      exam_id: examId,
      question_id: questionId,
      marks,
      position: startPosition + idx,
    }));

    const { error } = await supabase.from('exam_questions').insert(rows);
    if (error) throw new Error(error.message);

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, data: { added: toInsert.length } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add questions to exam',
    };
  }
}

export async function removeQuestionFromExam(examId: string, questionId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('exam_questions')
      .delete()
      .eq('exam_id', examId)
      .eq('question_id', questionId);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove question from exam' };
  }
}

// ============ EXAM ATTEMPTS ============

export async function startExamAttempt(examId: string): Promise<ActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    // Check for existing incomplete attempt
    const { data: existingAttempt } = await supabase
      .from('exam_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('exam_id', examId)
      .is('completed_at', null)
      .single();

    if (existingAttempt) {
      return { success: true, data: formatResponse(existingAttempt) };
    }

    const { data, error } = await supabase
      .from('exam_attempts')
      .insert({
        user_id: user.id,
        exam_id: examId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponse(data) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to start exam attempt' };
  }
}

export async function submitExamAnswer(
  attemptId: string,
  questionId: string,
  selectedAnswer: string
): Promise<ActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    // Verify attempt belongs to user
    const { data: attempt } = await supabase
      .from('exam_attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .is('completed_at', null)
      .single();

    if (!attempt) {
      throw new Error('Invalid or completed attempt');
    }

    // Get correct answer
    const { data: question } = await supabase
      .from('questions')
      .select('correct_answer, options')
      .eq('id', questionId)
      .single();

    const options = (question?.options as any[]) || [];
    const selectedOption = options.find((opt) => opt.id === selectedAnswer);

    // Support both ID-based (new) and Text-based (old) matching for backward compatibility
    const isCorrect = question?.correct_answer === selectedAnswer || 
      (selectedOption && question?.correct_answer === selectedOption.text);

    // Upsert answer
    const { data: existingAnswer } = await supabase
      .from('exam_answers')
      .select('id')
      .eq('attempt_id', attemptId)
      .eq('question_id', questionId)
      .single();

    if (existingAnswer) {
      const { data, error } = await supabase
        .from('exam_answers')
        .update({
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
        })
        .eq('id', existingAnswer.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { success: true, data: formatResponse(data) };
    }

    const { data, error } = await supabase
      .from('exam_answers')
      .insert({
        attempt_id: attemptId,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data: formatResponse(data) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit answer' };
  }
}

export async function completeExamAttempt(attemptId: string): Promise<ActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const { data: attempt } = await supabase
      .from('exam_attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (!attempt) throw new Error('Exam attempt not found');
    if (attempt.completed_at) throw new Error('Attempt already completed');

    // Calculate score
    const { data: answers } = await supabase
      .from('exam_answers')
      .select('*')
      .eq('attempt_id', attemptId);

    let score = 0;
    if (answers) {
      for (const answer of answers) {
        if (answer.is_correct) {
          const { data: eq } = await supabase
            .from('exam_questions')
            .select('marks')
            .eq('exam_id', attempt.exam_id)
            .eq('question_id', answer.question_id)
            .single();

          if (eq) score += eq.marks;
        }
      }
    }
    const { data, error } = await supabase
      .from('exam_attempts')
      .update({
        completed_at: new Date().toISOString(),
        score,
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/exams');
    return { success: true, data: formatResponse(data) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to complete exam' };
  }
}

export interface ExamAttemptWithAnswers {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  exam: {
    id: string;
    title: string;
    description?: string;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    examType?: string;
  };
  questions: {
    id: string;
    questionId: string;
    marks: number;
    position: number;
    question: {
      id: string;
      questionText: string;
      questionType: string;
      options: { id: string; text: string; isCorrect: boolean }[];
      correctAnswer: string;
      explanation?: string;
      difficulty: string;
    };
  }[];
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export async function getExamAttemptWithAnswers(attemptId: string): Promise<ActionResult<ExamAttemptWithAnswers>> {
  try {
    const supabase = createAdminClient();

    // Get attempt with exam
    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .select('*, exam:exams(*)')
      .eq('id', attemptId)
      .single();

    if (attemptError) {
      if (attemptError.code === 'PGRST116') throw new Error('Attempt not found');
      throw new Error(attemptError.message);
    }

    // Get exam questions with full question data
    const { data: examQuestions, error: questionsError } = await supabase
      .from('exam_questions')
      .select('*, question:questions(*)')
      .eq('exam_id', attempt.exam_id)
      .order('position');

    if (questionsError) throw new Error(questionsError.message);

    // Get user's answers for this attempt
    const { data: answers, error: answersError } = await supabase
      .from('exam_answers')
      .select('*')
      .eq('attempt_id', attemptId);

    if (answersError) throw new Error(answersError.message);

    const result: ExamAttemptWithAnswers = {
      ...formatResponse(attempt),
      exam: attempt.exam ? formatResponse(attempt.exam) : null,
      questions: (examQuestions || []).map((eq: any) => ({
        ...formatResponse(eq),
        question: eq.question ? formatResponse(eq.question) : null,
      })),
      answers: (answers || []).map((a: any) => ({
        questionId: a.question_id,
        selectedAnswer: a.selected_answer,
        isCorrect: a.is_correct,
      })),
    } as ExamAttemptWithAnswers;

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch attempt details' };
  }
}
