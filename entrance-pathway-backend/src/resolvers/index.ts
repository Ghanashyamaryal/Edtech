import { authResolvers } from './auth';
import { userResolvers } from './users';
import { courseResolvers } from './courses';
import { questionResolvers } from './questions';
import { examResolvers } from './exams';

// Merge all resolvers
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...courseResolvers.Query,
    ...questionResolvers.Query,
    ...examResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...questionResolvers.Mutation,
    ...examResolvers.Mutation,
  },
  // Type resolvers
  Course: courseResolvers.Course,
  Chapter: courseResolvers.Chapter,
  Enrollment: courseResolvers.Enrollment,
  Subject: questionResolvers.Subject,
  Topic: questionResolvers.Topic,
  Question: questionResolvers.Question,
  Exam: examResolvers.Exam,
  ExamQuestion: examResolvers.ExamQuestion,
  ExamAttempt: examResolvers.ExamAttempt,
};
