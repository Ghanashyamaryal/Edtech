import { gql } from '@apollo/client';

export const GET_EXAMS = gql`
  query GetExams($isPublished: Boolean, $limit: Int, $offset: Int) {
    exams(isPublished: $isPublished, limit: $limit, offset: $offset) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      isPublished
      questionsCount
      createdAt
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
        totalMarks
        passingMarks
      }
      startedAt
      completedAt
      score
    }
  }
`;
