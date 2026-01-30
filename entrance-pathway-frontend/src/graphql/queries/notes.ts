import { gql } from '@apollo/client';

// Get all notes with filters
export const GET_NOTES = gql`
  query GetNotes(
    $subjectId: ID
    $topicId: ID
    $noteType: NoteType
    $isPublished: Boolean
    $isPremium: Boolean
    $limit: Int
    $offset: Int
  ) {
    notes(
      subjectId: $subjectId
      topicId: $topicId
      noteType: $noteType
      isPublished: $isPublished
      isPremium: $isPremium
      limit: $limit
      offset: $offset
    ) {
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
      subject {
        id
        name
        icon
      }
      topic {
        id
        name
      }
      year
      isPremium
      isPublished
      downloadCount
      uploadedBy
      uploader {
        id
        fullName
      }
      createdAt
      updatedAt
    }
  }
`;

// Get published notes for landing page
export const GET_LANDING_NOTES = gql`
  query GetLandingNotes($limit: Int) {
    notes(isPublished: true, limit: $limit) {
      id
      title
      description
      fileUrl
      fileName
      fileSize
      fileType
      noteType
      subject {
        id
        name
        icon
      }
      year
      isPremium
      downloadCount
      createdAt
    }
  }
`;

// Get notes by subject
export const GET_NOTES_BY_SUBJECT = gql`
  query GetNotesBySubject($subjectId: ID!) {
    notesBySubject(subjectId: $subjectId) {
      id
      title
      description
      fileUrl
      fileName
      fileSize
      fileType
      noteType
      topic {
        id
        name
      }
      year
      isPremium
      downloadCount
      createdAt
    }
  }
`;

// Get single note
export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    note(id: $id) {
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
      subject {
        id
        name
        icon
      }
      topic {
        id
        name
      }
      year
      isPremium
      isPublished
      downloadCount
      uploadedBy
      uploader {
        id
        fullName
      }
      createdAt
      updatedAt
    }
  }
`;

// Get subjects with notes count
export const GET_SUBJECTS_WITH_NOTES = gql`
  query GetSubjectsWithNotes {
    subjects {
      id
      name
      description
      icon
      topicsCount
      questionsCount
      notesCount
    }
  }
`;

// Get admin notes (all notes including unpublished)
export const GET_ADMIN_NOTES = gql`
  query GetAdminNotes($limit: Int, $offset: Int) {
    notes(limit: $limit, offset: $offset) {
      id
      title
      description
      fileUrl
      fileName
      fileSize
      fileType
      noteType
      subject {
        id
        name
      }
      topic {
        id
        name
      }
      year
      isPremium
      isPublished
      downloadCount
      uploader {
        id
        fullName
      }
      createdAt
    }
  }
`;
