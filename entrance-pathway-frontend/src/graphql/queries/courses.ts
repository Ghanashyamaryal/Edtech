import { gql } from '@apollo/client';

export const GET_COURSES = gql`
  query GetCourses($limit: Int, $offset: Int, $isPublished: Boolean) {
    courses(limit: $limit, offset: $offset, isPublished: $isPublished) {
      id
      title
      fullName
      description
      slug
      thumbnailUrl
      price
      discountedPrice
      durationHours
      studentCount
      rating
      reviewsCount
      features
      isBestseller
      isPublished
      instructor {
        id
        fullName
        avatarUrl
      }
      chaptersCount
      lessonsCount
      enrollmentsCount
      createdAt
    }
  }
`;

// Query for landing page courses list
export const GET_LANDING_COURSES = gql`
  query GetLandingCourses {
    courses(isPublished: true) {
      id
      title
      fullName
      description
      slug
      thumbnailUrl
      price
      discountedPrice
      durationHours
      studentCount
      rating
      reviewsCount
      features
      isBestseller
      instructor {
        id
        fullName
        avatarUrl
      }
      chaptersCount
      lessonsCount
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID, $slug: String) {
    course(id: $id, slug: $slug) {
      id
      title
      fullName
      description
      slug
      thumbnailUrl
      price
      discountedPrice
      durationHours
      studentCount
      rating
      reviewsCount
      features
      isBestseller
      isPublished
      instructor {
        id
        fullName
        avatarUrl
      }
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

export const GET_ENROLLED_COURSES = gql`
  query GetEnrolledCourses($userId: ID!) {
    enrolledCourses(userId: $userId) {
      id
      course {
        id
        title
        slug
        thumbnailUrl
        instructor {
          fullName
        }
      }
      progress
      enrolledAt
    }
  }
`;
