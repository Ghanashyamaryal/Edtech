import { gql } from '@apollo/client';

export const GET_EXAMS = gql`
  query GetExams($isPublished: Boolean, $examType: ExamType, $courseId: ID, $limit: Int, $offset: Int) {
    exams(isPublished: $isPublished, examType: $examType, courseId: $courseId, limit: $limit, offset: $offset) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      examType
      setNumber
      isPublished
      questionsCount
      courses {
        id
        title
        slug
      }
      createdAt
    }
  }
`;

// Query for landing page - published exams only
export const GET_LANDING_EXAMS = gql`
  query GetLandingExams {
    exams(isPublished: true, limit: 50) {
      id
      title
      description
      durationMinutes
      totalMarks
      examType
      setNumber
      questionsCount
      courses {
        id
        title
        slug
      }
    }
  }
`;

export const GET_EXAM = gql`
  query GetExam($id: ID!) {
    exam(id: $id) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      isPublished
      questions {
        id
        marks
        position
        question {
          id
          questionText
          questionType
          options {
            id
            text
          }
        }
      }
    }
  }
`;

export const GET_EXAM_ATTEMPT = gql`
  query GetExamAttempt($id: ID!) {
    examAttempt(id: $id) {
      id
      examId
      userId
      startedAt
      completedAt
      score
      answers {
        questionId
        selectedAnswer
        isCorrect
      }
    }
  }
`;

export const GET_USER_EXAM_ATTEMPTS = gql`
  query GetUserExamAttempts($userId: ID!, $examId: ID) {
    userExamAttempts(userId: $userId, examId: $examId) {
      id
      exam {
        id
        title
        description
        durationMinutes
        totalMarks
        passingMarks
        examType
        questionsCount
      }
      startedAt
      completedAt
      score
    }
  }
`;
