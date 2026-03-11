// Server Actions - replaces GraphQL API calls
// Usage: import { getCourses, createCourse } from '@/actions';

// Courses
export {
  getCourses,
  getCourse,
  getCourseBySlug,
  getCourseWithChapters,
  getPublishedCourses,
  getEnrolledCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  enrollInCourse,
  type Course,
  type CourseInput,
} from './courses';

// Chapters & Lessons
export {
  getChapters,
  getChapter,
  getChapterWithLessons,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  updateLessonProgress,
  type Chapter,
  type Lesson,
  type CreateChapterInput,
  type CreateLessonInput,
} from './chapters';

// Exams
export {
  getExams,
  getExam,
  getExamWithCourses,
  getExamWithQuestions,
  getCourseExams,
  getPublishedExams,
  getUserExamAttempts,
  createExam,
  updateExam,
  deleteExam,
  linkExamToCourse,
  unlinkExamFromCourse,
  reorderCourseExams,
  addQuestionToExam,
  removeQuestionFromExam,
  startExamAttempt,
  submitExamAnswer,
  completeExamAttempt,
  type Exam,
  type CourseExam,
  type ExamInput,
  type ExamAttempt,
  getExamAttemptWithAnswers,
  type ExamAttemptWithAnswers,
} from './exams';

// Subjects & Topics
export {
  getSubjects,
  getSubject,
  getCourseSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  linkSubjectToCourse,
  unlinkSubjectFromCourse,
  reorderCourseSubjects,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  type Subject,
  type Topic,
  type CourseSubject,
  type CreateSubjectInput,
  type CreateTopicInput,
} from './subjects';

// Questions
export {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  type Question,
  type QuestionOption,
  type CreateQuestionInput,
} from './questions';

// Notes
export {
  getNotes,
  getNote,
  getNotesBySubject,
  createNote,
  updateNote,
  deleteNote,
  publishNote,
  incrementNoteDownload,
  uploadNoteFile,
  type Note,
  type CreateNoteInput,
  type UpdateNoteInput,
} from './notes';

// Users
export {
  getUsers,
  getUser,
  getCurrentUserProfile,
  updateUserRole,
  updateProfile,
  getDashboardStats,
  type User,
  type UserRole,
} from './users';

// Live Classes
export {
  getLiveClasses,
  getLiveClass,
  getUpcomingLiveClasses,
  getLiveNowClasses,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  type LiveClass,
  type CreateLiveClassInput,
  type UpdateLiveClassInput,
} from './live-classes';

// Recorded Lectures
export {
  getRecordedLectures,
  getRecordedLecture,
  getPublishedLectures,
  createRecordedLecture,
  updateRecordedLecture,
  deleteRecordedLecture,
  publishRecordedLecture,
  incrementLectureView,
  type RecordedLecture,
  type CreateRecordedLectureInput,
  type UpdateRecordedLectureInput,
} from './recorded-lectures';

// Utils
export { type ActionResult } from './utils';
