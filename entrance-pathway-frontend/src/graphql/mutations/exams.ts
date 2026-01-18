import { gql } from '@apollo/client';

export const START_EXAM_ATTEMPT = gql`
  mutation StartExamAttempt($examId: ID!) {
    startExamAttempt(examId: $examId) {
      id
      examId
      userId
      startedAt
    }
  }
`;

export const SUBMIT_EXAM_ANSWER = gql`
  mutation SubmitExamAnswer($attemptId: ID!, $questionId: ID!, $selectedAnswer: String!) {
    submitExamAnswer(
      attemptId: $attemptId
      questionId: $questionId
      selectedAnswer: $selectedAnswer
    ) {
      id
      questionId
      selectedAnswer
    }
  }
`;

export const COMPLETE_EXAM_ATTEMPT = gql`
  mutation CompleteExamAttempt($attemptId: ID!) {
    completeExamAttempt(attemptId: $attemptId) {
      id
      completedAt
      score
    }
  }
`;
