'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, type ActionResult } from './utils';

// Types
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer';
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subjectId: string;
  topicId?: string;
  subject?: { id: string; name: string } | null;
  topic?: { id: string; name: string } | null;
  createdAt: string;
}

export interface CreateQuestionInput {
  questionText: string;
  questionType: string;
  options: QuestionOption[];
  explanation?: string;
  difficulty: string;
  subjectId: string;
  topicId?: string;
}

// ============ QUERIES ============

export async function getQuestions(options?: {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<Question[]>> {
  try {
    const supabase = createAdminClient();
    const { subjectId, topicId, difficulty, limit = 20, offset = 0 } = options || {};

    let query = supabase
      .from('questions')
      .select(`
        *,
        subjects:subject_id (id, name),
        topics:topic_id (id, name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (subjectId) query = query.eq('subject_id', subjectId);
    if (topicId) query = query.eq('topic_id', topicId);
    if (difficulty) query = query.eq('difficulty', difficulty);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Transform the data to match our interface
    const questions = (data || []).map((q: any) => ({
      ...formatResponse(q),
      subject: q.subjects || null,
      topic: q.topics || null,
    }));

    return { success: true, data: questions as Question[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch questions' };
  }
}

export async function getQuestion(id: string): Promise<ActionResult<Question>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        subjects:subject_id (id, name),
        topics:topic_id (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Question not found');
      throw new Error(error.message);
    }

    const question = {
      ...formatResponse(data),
      subject: data.subjects || null,
      topic: data.topics || null,
    };

    return { success: true, data: question as Question };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch question' };
  }
}

// ============ MUTATIONS ============

export async function createQuestion(input: CreateQuestionInput): Promise<ActionResult<Question>> {
  try {
    const supabase = createAdminClient();

    // Determine correct answer from options
    const correctOption = input.options.find((opt) => opt.isCorrect);
    const correctAnswer = correctOption?.id || '';

    const { data, error } = await supabase
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

    if (error) throw new Error(error.message);

    revalidatePath('/admin/questions');
    return { success: true, data: formatResponse(data) as Question };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create question' };
  }
}

export async function updateQuestion(id: string, input: CreateQuestionInput): Promise<ActionResult<Question>> {
  try {
    const supabase = createAdminClient();

    const correctOption = input.options.find((opt) => opt.isCorrect);
    const correctAnswer = correctOption?.id || '';

    const { data, error } = await supabase
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

    if (error) throw new Error(error.message);

    revalidatePath('/admin/questions');
    revalidatePath(`/admin/questions/${id}`);
    return { success: true, data: formatResponse(data) as Question };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update question' };
  }
}

export async function bulkCreateQuestions(
  questions: CreateQuestionInput[]
): Promise<ActionResult<{ created: number; failed: number }>> {
  try {
    const supabase = createAdminClient();

    const rows = questions.map((q) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      return {
        question_text: q.questionText,
        question_type: q.questionType,
        options: q.options,
        correct_answer: correctOption?.id || '',
        explanation: q.explanation,
        difficulty: q.difficulty,
        subject_id: q.subjectId,
        topic_id: q.topicId,
      };
    });

    const { data, error } = await supabase
      .from('questions')
      .insert(rows)
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/questions');
    revalidatePath('/admin/question-bank');
    return { success: true, data: { created: data?.length || 0, failed: 0 } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to bulk create questions' };
  }
}

export async function deleteQuestion(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from('questions').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/questions');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete question' };
  }
}
