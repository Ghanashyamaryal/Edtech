import { authResolvers } from './auth';
import { userResolvers } from './users';
import { courseResolvers } from './courses';
import { questionResolvers } from './questions';
import { examResolvers } from './exams';
import { notesResolvers } from './notes';

// Merge all resolvers
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...courseResolvers.Query,
    ...questionResolvers.Query,
    ...examResolvers.Query,
    ...notesResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...questionResolvers.Mutation,
    ...examResolvers.Mutation,
    ...notesResolvers.Mutation,
  },
  // Type resolvers
  Course: courseResolvers.Course,
  Chapter: courseResolvers.Chapter,
  Enrollment: courseResolvers.Enrollment,
  Subject: {
    ...questionResolvers.Subject,
    ...notesResolvers.Subject,
  },
  Topic: questionResolvers.Topic,
  Question: questionResolvers.Question,
  Exam: examResolvers.Exam,
  CourseExam: examResolvers.CourseExam,
  ExamQuestion: examResolvers.ExamQuestion,
  ExamAttempt: examResolvers.ExamAttempt,
  Note: notesResolvers.Note,
  CourseSubject: notesResolvers.CourseSubject,
};
