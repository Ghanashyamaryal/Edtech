'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_EXAMS, GET_EXAM, GET_EXAM_ATTEMPT, GET_USER_EXAM_ATTEMPTS } from '@/graphql/queries/exams';
import { START_EXAM_ATTEMPT, SUBMIT_EXAM_ANSWER, COMPLETE_EXAM_ATTEMPT } from '@/graphql/mutations/exams';

export function useExams(options?: { isPublished?: boolean; limit?: number; offset?: number }) {
  return useQuery(GET_EXAMS, {
    variables: {
      isPublished: options?.isPublished,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    },
  });
}

export function useExam(id: string) {
  return useQuery(GET_EXAM, {
    variables: { id },
    skip: !id,
  });
}

export function useExamAttempt(id: string) {
  return useQuery(GET_EXAM_ATTEMPT, {
    variables: { id },
    skip: !id,
  });
}

export function useUserExamAttempts(userId: string, examId?: string) {
  return useQuery(GET_USER_EXAM_ATTEMPTS, {
    variables: { userId, examId },
    skip: !userId,
  });
}

export function useStartExamAttempt() {
  return useMutation(START_EXAM_ATTEMPT);
}

export function useSubmitExamAnswer() {
  return useMutation(SUBMIT_EXAM_ANSWER);
}

export function useCompleteExamAttempt() {
  return useMutation(COMPLETE_EXAM_ATTEMPT, {
    refetchQueries: ['GetUserExamAttempts'],
  });
}
