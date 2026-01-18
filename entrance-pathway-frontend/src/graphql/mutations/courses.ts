import { gql } from '@apollo/client';

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      slug
      description
      thumbnailUrl
      price
      isPublished
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      slug
      description
      thumbnailUrl
      price
      isPublished
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: ID!) {
    enrollInCourse(courseId: $courseId) {
      id
      courseId
      userId
      enrolledAt
    }
  }
`;

export const UPDATE_LESSON_PROGRESS = gql`
  mutation UpdateLessonProgress($lessonId: ID!, $watchedDuration: Int!, $isCompleted: Boolean) {
    updateLessonProgress(
      lessonId: $lessonId
      watchedDuration: $watchedDuration
      isCompleted: $isCompleted
    ) {
      id
      lessonId
      isCompleted
      watchedDuration
    }
  }
`;
