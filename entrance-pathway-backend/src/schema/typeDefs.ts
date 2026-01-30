export const typeDefs = `#graphql
  # Enums
  enum UserRole {
    student
    mentor
    admin
  }

  enum QuestionType {
    multiple_choice
    true_false
    short_answer
  }

  enum DifficultyLevel {
    easy
    medium
    hard
  }

  enum ExamType {
    full_model
    subject
    chapter
    practice
    previous_year
  }

  enum NoteType {
    notes
    question_paper
    solution
    syllabus
    formula_sheet
  }

  # Auth Types
  type AuthPayload {
    user: User!
    accessToken: String!
  }

  type User {
    id: ID!
    email: String!
    fullName: String!
    avatarUrl: String
    phone: String
    phoneVerified: Boolean
    emailVerified: Boolean
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  # Auth Input Types
  input SignUpInput {
    email: String!
    password: String!
    fullName: String!
    role: UserRole!
    phone: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    fullName: String
    avatarUrl: String
    phone: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type Course {
    id: ID!
    title: String!
    fullName: String
    description: String!
    slug: String!
    thumbnailUrl: String
    price: Float!
    discountedPrice: Float
    durationHours: Int
    studentCount: Int
    rating: Float
    reviewsCount: Int
    features: [String!]
    isBestseller: Boolean
    isPublished: Boolean!
    instructorId: ID!
    instructor: User
    chapters: [Chapter!]
    chaptersCount: Int
    lessonsCount: Int
    enrollmentsCount: Int
    exams: [Exam!]
    examsCount: Int
    createdAt: String!
    updatedAt: String!
  }

  type Chapter {
    id: ID!
    title: String!
    description: String
    position: Int!
    isPublished: Boolean!
    courseId: ID!
    lessons: [Lesson!]
  }

  type Lesson {
    id: ID!
    title: String!
    description: String
    videoUrl: String
    duration: Int
    position: Int!
    isPublished: Boolean!
    isFree: Boolean!
    chapterId: ID!
  }

  type Subject {
    id: ID!
    name: String!
    description: String
    icon: String
    topics: [Topic!]
    topicsCount: Int
    questionsCount: Int
    notesCount: Int
    notes: [Note!]
  }

  type Topic {
    id: ID!
    name: String!
    description: String
    subjectId: ID!
    questionsCount: Int
  }

  type QuestionOption {
    id: ID!
    text: String!
    isCorrect: Boolean
  }

  type Question {
    id: ID!
    questionText: String!
    questionType: QuestionType!
    options: [QuestionOption!]!
    correctAnswer: String
    explanation: String
    difficulty: DifficultyLevel!
    subjectId: ID!
    topicId: ID
    subject: Subject
    topic: Topic
    createdAt: String!
  }

  type Exam {
    id: ID!
    title: String!
    description: String
    durationMinutes: Int!
    totalMarks: Int!
    passingMarks: Int!
    examType: ExamType
    setNumber: Int
    isPublished: Boolean!
    questions: [ExamQuestion!]
    questionsCount: Int
    courses: [Course!]
    createdAt: String!
  }

  type CourseExam {
    id: ID!
    courseId: ID!
    examId: ID!
    course: Course
    exam: Exam
    displayOrder: Int
    isRequired: Boolean
  }

  type ExamQuestion {
    id: ID!
    examId: ID!
    questionId: ID!
    question: Question
    marks: Int!
    position: Int!
  }

  type ExamAttempt {
    id: ID!
    examId: ID!
    userId: ID!
    exam: Exam
    startedAt: String!
    completedAt: String
    score: Int
    answers: [ExamAnswer!]
  }

  type ExamAnswer {
    id: ID!
    attemptId: ID!
    questionId: ID!
    selectedAnswer: String!
    isCorrect: Boolean!
  }

  type Enrollment {
    id: ID!
    userId: ID!
    courseId: ID!
    course: Course
    enrolledAt: String!
    completedAt: String
    progress: Int!
  }

  type LessonProgress {
    id: ID!
    userId: ID!
    lessonId: ID!
    isCompleted: Boolean!
    watchedDuration: Int!
    completedAt: String
  }

  type LiveClass {
    id: ID!
    title: String!
    description: String
    scheduledAt: String!
    durationMinutes: Int!
    zoomMeetingId: String
    zoomJoinUrl: String
    recordingUrl: String
    instructorId: ID!
    courseId: ID
    isCompleted: Boolean!
  }

  type Note {
    id: ID!
    title: String!
    description: String
    fileUrl: String!
    fileName: String!
    fileSize: Int!
    fileType: String!
    noteType: NoteType!
    subjectId: ID!
    topicId: ID
    subject: Subject
    topic: Topic
    year: Int
    isPremium: Boolean!
    isPublished: Boolean!
    downloadCount: Int!
    uploadedBy: ID!
    uploader: User
    createdAt: String!
    updatedAt: String!
  }

  type CourseSubject {
    id: ID!
    courseId: ID!
    subjectId: ID!
    course: Course
    subject: Subject
    displayOrder: Int!
  }

  # Input Types
  input CreateSubjectInput {
    name: String!
    description: String
    icon: String
  }

  input CreateTopicInput {
    subjectId: ID!
    name: String!
    description: String
  }

  input CreateCourseInput {
    title: String!
    fullName: String
    description: String!
    thumbnailUrl: String
    price: Float!
    discountedPrice: Float
    durationHours: Int
    features: [String!]
    isBestseller: Boolean
  }

  input UpdateCourseInput {
    title: String
    fullName: String
    description: String
    thumbnailUrl: String
    price: Float
    discountedPrice: Float
    durationHours: Int
    features: [String!]
    isBestseller: Boolean
    isPublished: Boolean
  }

  input CreateChapterInput {
    courseId: ID!
    title: String!
    description: String
  }

  input CreateLessonInput {
    chapterId: ID!
    title: String!
    description: String
    videoUrl: String
    isFree: Boolean
  }

  input CreateQuestionInput {
    questionText: String!
    questionType: QuestionType!
    options: [QuestionOptionInput!]!
    explanation: String
    difficulty: DifficultyLevel!
    subjectId: ID!
    topicId: ID
  }

  input QuestionOptionInput {
    text: String!
    isCorrect: Boolean!
  }

  input CreateExamInput {
    title: String!
    description: String
    durationMinutes: Int!
    totalMarks: Int!
    passingMarks: Int!
    examType: ExamType
    setNumber: Int
    courseId: ID
  }

  input CreateNoteInput {
    title: String!
    description: String
    fileUrl: String!
    fileName: String!
    fileSize: Int!
    fileType: String!
    noteType: NoteType!
    subjectId: ID!
    topicId: ID
    year: Int
    isPremium: Boolean
  }

  input UpdateNoteInput {
    title: String
    description: String
    fileUrl: String
    fileName: String
    fileSize: Int
    fileType: String
    noteType: NoteType
    subjectId: ID
    topicId: ID
    year: Int
    isPremium: Boolean
    isPublished: Boolean
  }

  # Queries
  type Query {
    # Auth queries
    me: User
    getCurrentUser: User
    getUserProfile(userId: ID!): User

    # User queries (admin)
    user(id: ID!): User
    users(role: UserRole, limit: Int, offset: Int): [User!]!

    # Course queries
    courses(limit: Int, offset: Int, isPublished: Boolean): [Course!]!
    course(id: ID, slug: String): Course
    enrolledCourses(userId: ID!): [Enrollment!]!

    # Subject and topic queries
    subjects: [Subject!]!
    subject(id: ID!): Subject
    topics(subjectId: ID!): [Topic!]!

    # Question queries
    questions(
      subjectId: ID
      topicId: ID
      difficulty: DifficultyLevel
      limit: Int
      offset: Int
    ): [Question!]!
    question(id: ID!): Question

    # Exam queries
    exams(isPublished: Boolean, courseId: ID, examType: ExamType, limit: Int, offset: Int): [Exam!]!
    exam(id: ID!): Exam
    courseExams(courseId: ID!): [CourseExam!]!
    examAttempt(id: ID!): ExamAttempt
    userExamAttempts(userId: ID!, examId: ID): [ExamAttempt!]!

    # Live class queries
    liveClasses(courseId: ID, upcoming: Boolean): [LiveClass!]!
    liveClass(id: ID!): LiveClass

    # Note queries
    notes(
      subjectId: ID
      topicId: ID
      noteType: NoteType
      isPublished: Boolean
      isPremium: Boolean
      limit: Int
      offset: Int
    ): [Note!]!
    note(id: ID!): Note
    notesBySubject(subjectId: ID!): [Note!]!

    # Course-Subject queries
    courseSubjects(courseId: ID!): [CourseSubject!]!
  }

  # Mutations
  type Mutation {
    # Auth mutations
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(input: ChangePasswordInput!): Boolean!
    updateUserRole(userId: ID!, role: UserRole!): User!

    # Course mutations
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
    publishCourse(id: ID!): Course!

    # Chapter mutations
    createChapter(input: CreateChapterInput!): Chapter!
    updateChapter(id: ID!, title: String, description: String): Chapter!
    deleteChapter(id: ID!): Boolean!
    reorderChapters(courseId: ID!, chapterIds: [ID!]!): [Chapter!]!

    # Lesson mutations
    createLesson(input: CreateLessonInput!): Lesson!
    updateLesson(id: ID!, title: String, description: String, videoUrl: String, isFree: Boolean): Lesson!
    deleteLesson(id: ID!): Boolean!
    reorderLessons(chapterId: ID!, lessonIds: [ID!]!): [Lesson!]!

    # Enrollment mutations
    enrollInCourse(courseId: ID!): Enrollment!
    updateLessonProgress(lessonId: ID!, watchedDuration: Int!, isCompleted: Boolean): LessonProgress!

    # Subject mutations
    createSubject(input: CreateSubjectInput!): Subject!
    updateSubject(id: ID!, name: String, description: String, icon: String): Subject!
    deleteSubject(id: ID!): Boolean!

    # Topic mutations
    createTopic(input: CreateTopicInput!): Topic!
    updateTopic(id: ID!, name: String, description: String): Topic!
    deleteTopic(id: ID!): Boolean!

    # Question mutations
    createQuestion(input: CreateQuestionInput!): Question!
    updateQuestion(id: ID!, input: CreateQuestionInput!): Question!
    deleteQuestion(id: ID!): Boolean!

    # Exam mutations
    createExam(input: CreateExamInput!): Exam!
    updateExam(id: ID!, input: CreateExamInput!): Exam!
    deleteExam(id: ID!): Boolean!
    addQuestionToExam(examId: ID!, questionId: ID!, marks: Int!): ExamQuestion!
    removeQuestionFromExam(examId: ID!, questionId: ID!): Boolean!

    # Course-Exam linking mutations
    linkExamToCourse(examId: ID!, courseId: ID!, displayOrder: Int, isRequired: Boolean): CourseExam!
    unlinkExamFromCourse(examId: ID!, courseId: ID!): Boolean!
    reorderCourseExams(courseId: ID!, examIds: [ID!]!): [CourseExam!]!

    # Exam attempt mutations
    startExamAttempt(examId: ID!): ExamAttempt!
    submitExamAnswer(attemptId: ID!, questionId: ID!, selectedAnswer: String!): ExamAnswer!
    completeExamAttempt(attemptId: ID!): ExamAttempt!

    # Note mutations
    createNote(input: CreateNoteInput!): Note!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
    deleteNote(id: ID!): Boolean!
    publishNote(id: ID!): Note!
    incrementNoteDownload(id: ID!): Note!

    # Course-Subject mutations
    linkSubjectToCourse(courseId: ID!, subjectId: ID!, displayOrder: Int): CourseSubject!
    unlinkSubjectFromCourse(courseId: ID!, subjectId: ID!): Boolean!
    reorderCourseSubjects(courseId: ID!, subjectIds: [ID!]!): [CourseSubject!]!
  }
`;
