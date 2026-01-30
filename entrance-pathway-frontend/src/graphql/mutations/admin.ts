import { gql } from "@apollo/client";

// User mutations
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      email
      fullName
      role
    }
  }
`;

// Course mutations
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      slug
      fullName
      discountedPrice
      durationHours
      features
      isBestseller
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      fullName
      description
      thumbnailUrl
      price
      discountedPrice
      durationHours
      features
      isBestseller
      isPublished
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export const PUBLISH_COURSE = gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      isPublished
    }
  }
`;

// Chapter mutations
export const CREATE_CHAPTER = gql`
  mutation CreateChapter($input: CreateChapterInput!) {
    createChapter(input: $input) {
      id
      title
      position
    }
  }
`;

export const UPDATE_CHAPTER = gql`
  mutation UpdateChapter($id: ID!, $title: String, $description: String) {
    updateChapter(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const DELETE_CHAPTER = gql`
  mutation DeleteChapter($id: ID!) {
    deleteChapter(id: $id)
  }
`;

export const REORDER_CHAPTERS = gql`
  mutation ReorderChapters($courseId: ID!, $chapterIds: [ID!]!) {
    reorderChapters(courseId: $courseId, chapterIds: $chapterIds) {
      id
      position
    }
  }
`;

// Lesson mutations
export const CREATE_LESSON = gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      title
      position
    }
  }
`;

export const UPDATE_LESSON = gql`
  mutation UpdateLesson(
    $id: ID!
    $title: String
    $description: String
    $videoUrl: String
    $isFree: Boolean
  ) {
    updateLesson(
      id: $id
      title: $title
      description: $description
      videoUrl: $videoUrl
      isFree: $isFree
    ) {
      id
      title
      description
      videoUrl
      isFree
    }
  }
`;

export const DELETE_LESSON = gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id)
  }
`;

export const REORDER_LESSONS = gql`
  mutation ReorderLessons($chapterId: ID!, $lessonIds: [ID!]!) {
    reorderLessons(chapterId: $chapterId, lessonIds: $lessonIds) {
      id
      position
    }
  }
`;

// Subject mutations
export const CREATE_SUBJECT = gql`
  mutation CreateSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      id
      name
      description
      icon
    }
  }
`;

export const UPDATE_SUBJECT = gql`
  mutation UpdateSubject($id: ID!, $name: String, $description: String, $icon: String) {
    updateSubject(id: $id, name: $name, description: $description, icon: $icon) {
      id
      name
      description
      icon
    }
  }
`;

export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`;

// Topic mutations
export const CREATE_TOPIC = gql`
  mutation CreateTopic($input: CreateTopicInput!) {
    createTopic(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_TOPIC = gql`
  mutation UpdateTopic($id: ID!, $name: String, $description: String) {
    updateTopic(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: ID!) {
    deleteTopic(id: $id)
  }
`;

// Question mutations
export const CREATE_QUESTION = gql`
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
      questionText
      questionType
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $input: CreateQuestionInput!) {
    updateQuestion(id: $id, input: $input) {
      id
      questionText
      questionType
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

// Exam mutations
export const CREATE_EXAM = gql`
  mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_EXAM = gql`
  mutation UpdateExam($id: ID!, $input: CreateExamInput!) {
    updateExam(id: $id, input: $input) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      isPublished
    }
  }
`;

export const DELETE_EXAM = gql`
  mutation DeleteExam($id: ID!) {
    deleteExam(id: $id)
  }
`;

export const ADD_QUESTION_TO_EXAM = gql`
  mutation AddQuestionToExam($examId: ID!, $questionId: ID!, $marks: Int!) {
    addQuestionToExam(examId: $examId, questionId: $questionId, marks: $marks) {
      id
      marks
      position
    }
  }
`;

export const REMOVE_QUESTION_FROM_EXAM = gql`
  mutation RemoveQuestionFromExam($examId: ID!, $questionId: ID!) {
    removeQuestionFromExam(examId: $examId, questionId: $questionId)
  }
`;

// Course-Exam linking mutations
export const LINK_EXAM_TO_COURSE = gql`
  mutation LinkExamToCourse($examId: ID!, $courseId: ID!, $displayOrder: Int, $isRequired: Boolean) {
    linkExamToCourse(examId: $examId, courseId: $courseId, displayOrder: $displayOrder, isRequired: $isRequired) {
      id
      courseId
      examId
      displayOrder
      isRequired
    }
  }
`;

export const UNLINK_EXAM_FROM_COURSE = gql`
  mutation UnlinkExamFromCourse($examId: ID!, $courseId: ID!) {
    unlinkExamFromCourse(examId: $examId, courseId: $courseId)
  }
`;

export const REORDER_COURSE_EXAMS = gql`
  mutation ReorderCourseExams($courseId: ID!, $examIds: [ID!]!) {
    reorderCourseExams(courseId: $courseId, examIds: $examIds) {
      id
      displayOrder
    }
  }
`;
