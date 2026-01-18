import { gql } from '@apollo/client';

export const GET_QUESTIONS = gql`
  query GetQuestions(
    $subjectId: ID
    $topicId: ID
    $difficulty: DifficultyLevel
    $limit: Int
    $offset: Int
  ) {
    questions(
      subjectId: $subjectId
      topicId: $topicId
      difficulty: $difficulty
      limit: $limit
      offset: $offset
    ) {
      id
      questionText
      questionType
      options {
        id
        text
      }
      difficulty
      subject {
        id
        name
      }
      topic {
        id
        name
      }
    }
  }
`;

export const GET_QUESTION = gql`
  query GetQuestion($id: ID!) {
    question(id: $id) {
      id
      questionText
      questionType
      options {
        id
        text
        isCorrect
      }
      correctAnswer
      explanation
      difficulty
      subject {
        id
        name
      }
      topic {
        id
        name
      }
    }
  }
`;

export const GET_SUBJECTS = gql`
  query GetSubjects {
    subjects {
      id
      name
      description
      icon
      topicsCount
      questionsCount
    }
  }
`;

export const GET_TOPICS = gql`
  query GetTopics($subjectId: ID!) {
    topics(subjectId: $subjectId) {
      id
      name
      description
      questionsCount
    }
  }
`;
