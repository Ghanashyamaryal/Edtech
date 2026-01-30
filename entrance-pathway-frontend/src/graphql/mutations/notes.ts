import { gql } from '@apollo/client';

// Create a new note
export const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      title
      description
      fileUrl
      fileName
      fileSize
      fileType
      noteType
      subjectId
      topicId
      year
      isPremium
      isPublished
      createdAt
    }
  }
`;

// Update a note
export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
      id
      title
      description
      fileUrl
      fileName
      fileSize
      fileType
      noteType
      subjectId
      topicId
      year
      isPremium
      isPublished
      updatedAt
    }
  }
`;

// Delete a note
export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

// Publish a note
export const PUBLISH_NOTE = gql`
  mutation PublishNote($id: ID!) {
    publishNote(id: $id) {
      id
      isPublished
    }
  }
`;

// Increment download count
export const INCREMENT_NOTE_DOWNLOAD = gql`
  mutation IncrementNoteDownload($id: ID!) {
    incrementNoteDownload(id: $id) {
      id
      downloadCount
    }
  }
`;

// Course-Subject linking mutations
export const LINK_SUBJECT_TO_COURSE = gql`
  mutation LinkSubjectToCourse($courseId: ID!, $subjectId: ID!, $displayOrder: Int) {
    linkSubjectToCourse(courseId: $courseId, subjectId: $subjectId, displayOrder: $displayOrder) {
      id
      courseId
      subjectId
      displayOrder
    }
  }
`;

export const UNLINK_SUBJECT_FROM_COURSE = gql`
  mutation UnlinkSubjectFromCourse($courseId: ID!, $subjectId: ID!) {
    unlinkSubjectFromCourse(courseId: $courseId, subjectId: $subjectId)
  }
`;

export const REORDER_COURSE_SUBJECTS = gql`
  mutation ReorderCourseSubjects($courseId: ID!, $subjectIds: [ID!]!) {
    reorderCourseSubjects(courseId: $courseId, subjectIds: $subjectIds) {
      id
      displayOrder
    }
  }
`;
