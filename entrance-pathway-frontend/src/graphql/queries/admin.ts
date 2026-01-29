import { gql } from "@apollo/client";

// User queries
export const GET_USERS = gql`
  query GetUsers($role: UserRole, $limit: Int, $offset: Int) {
    users(role: $role, limit: $limit, offset: $offset) {
      id
      email
      fullName
      avatarUrl
      phone
      role
      createdAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      fullName
      avatarUrl
      phone
      phoneVerified
      emailVerified
      role
      createdAt
      updatedAt
    }
  }
`;

// Course queries for admin
export const GET_ADMIN_COURSES = gql`
  query GetAdminCourses($limit: Int, $offset: Int, $isPublished: Boolean) {
    courses(limit: $limit, offset: $offset, isPublished: $isPublished) {
      id
      title
      slug
      thumbnailUrl
      price
      isPublished
      chaptersCount
      lessonsCount
      enrollmentsCount
      instructor {
        id
        fullName
      }
      createdAt
    }
  }
`;

export const GET_ADMIN_COURSE = gql`
  query GetAdminCourse($id: ID, $slug: String) {
    course(id: $id, slug: $slug) {
      id
      title
      description
      slug
      thumbnailUrl
      price
      isPublished
      instructorId
      chapters {
        id
        title
        description
        position
        isPublished
        lessons {
          id
          title
          description
          videoUrl
          duration
          position
          isPublished
          isFree
        }
      }
      createdAt
      updatedAt
    }
  }
`;

// Subject and topic queries
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

export const GET_SUBJECT = gql`
  query GetSubject($id: ID!) {
    subject(id: $id) {
      id
      name
      description
      icon
      topics {
        id
        name
        description
        questionsCount
      }
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

// Question queries
export const GET_ADMIN_QUESTIONS = gql`
  query GetAdminQuestions(
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
      difficulty
      subject {
        id
        name
      }
      topic {
        id
        name
      }
      createdAt
    }
  }
`;

export const GET_ADMIN_QUESTION = gql`
  query GetAdminQuestion($id: ID!) {
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
      subjectId
      topicId
      subject {
        id
        name
      }
      topic {
        id
        name
      }
      createdAt
    }
  }
`;

// Exam queries
export const GET_ADMIN_EXAMS = gql`
  query GetAdminExams($isPublished: Boolean, $limit: Int, $offset: Int) {
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

export const GET_ADMIN_EXAM = gql`
  query GetAdminExam($id: ID!) {
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
        questionId
        marks
        position
        question {
          id
          questionText
          questionType
          difficulty
        }
      }
      questionsCount
      createdAt
    }
  }
`;
