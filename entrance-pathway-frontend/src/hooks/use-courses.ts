'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_COURSES, GET_COURSE, GET_ENROLLED_COURSES } from '@/graphql/queries/courses';
import { ENROLL_IN_COURSE, UPDATE_LESSON_PROGRESS } from '@/graphql/mutations/courses';

export function useCourses(options?: { limit?: number; offset?: number; isPublished?: boolean }) {
  return useQuery(GET_COURSES, {
    variables: {
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      isPublished: options?.isPublished,
    },
  });
}

export function useCourse(id?: string, slug?: string) {
  return useQuery(GET_COURSE, {
    variables: { id, slug },
    skip: !id && !slug,
  });
}

export function useEnrolledCourses(userId: string) {
  return useQuery(GET_ENROLLED_COURSES, {
    variables: { userId },
    skip: !userId,
  });
}

export function useEnrollInCourse() {
  return useMutation(ENROLL_IN_COURSE, {
    refetchQueries: ['GetEnrolledCourses'],
  });
}

export function useUpdateLessonProgress() {
  return useMutation(UPDATE_LESSON_PROGRESS);
}
