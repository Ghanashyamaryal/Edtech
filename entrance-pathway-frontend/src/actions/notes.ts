'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, requireAuth } from '@/lib/supabase/server';
import { formatResponse, formatResponseArray, toSnakeCase, type ActionResult } from './utils';

// Types
export interface Note {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  noteType: string;
  subjectId: string;
  topicId?: string;
  subject?: { id: string; name: string } | null;
  topic?: { id: string; name: string } | null;
  uploader?: { id: string; fullName: string } | null;
  year?: number;
  isPremium: boolean;
  isPublished: boolean;
  downloadCount: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  noteType: string;
  subjectId: string;
  topicId?: string;
  year?: number;
  isPremium?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  noteType?: string;
  subjectId?: string;
  topicId?: string;
  year?: number;
  isPremium?: boolean;
  isPublished?: boolean;
}

// ============ QUERIES ============

export async function getNotes(options?: {
  subjectId?: string;
  topicId?: string;
  noteType?: string;
  isPublished?: boolean;
  isPremium?: boolean;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<Note[]>> {
  try {
    const supabase = createAdminClient();
    const { subjectId, topicId, noteType, isPublished, isPremium, limit = 20, offset = 0 } = options || {};

    let query = supabase
      .from('notes')
      .select(`
        *,
        subjects:subject_id (id, name),
        topics:topic_id (id, name),
        users:uploaded_by (id, full_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (subjectId) query = query.eq('subject_id', subjectId);
    if (topicId) query = query.eq('topic_id', topicId);
    if (noteType) query = query.eq('note_type', noteType);
    if (isPublished !== undefined) query = query.eq('is_published', isPublished);
    if (isPremium !== undefined) query = query.eq('is_premium', isPremium);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Transform the data to match our interface
    const notes = (data || []).map((n: any) => ({
      ...formatResponse(n),
      subject: n.subjects || null,
      topic: n.topics || null,
      uploader: n.users ? { id: n.users.id, fullName: n.users.full_name } : null,
    }));

    return { success: true, data: notes as Note[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch notes' };
  }
}

export async function getNote(id: string): Promise<ActionResult<Note>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        subjects:subject_id (id, name),
        topics:topic_id (id, name),
        users:uploaded_by (id, full_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Note not found');
      throw new Error(error.message);
    }

    const note = {
      ...formatResponse(data),
      subject: data.subjects || null,
      topic: data.topics || null,
      uploader: data.users ? { id: data.users.id, fullName: data.users.full_name } : null,
    };

    return { success: true, data: note as Note };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch note' };
  }
}

export async function getNotesBySubject(subjectId: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponseArray(data || []) as Note[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch notes' };
  }
}

// ============ FILE UPLOAD ============

export async function uploadNoteFile(formData: FormData): Promise<ActionResult<{ url: string; fileName: string; fileSize: number; fileType: string }>> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const file = formData.get('file') as File;
    const subjectId = formData.get('subjectId') as string;
    const noteType = formData.get('noteType') as string;

    if (!file || !file.size) {
      throw new Error('No file provided');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${subjectId || 'general'}/${noteType || 'notes'}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error } = await supabase.storage
      .from('notes')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = supabase.storage.from('notes').getPublicUrl(filePath);

    return {
      success: true,
      data: {
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to upload file' };
  }
}

// ============ MUTATIONS ============

export async function createNote(input: CreateNoteInput): Promise<ActionResult<Note>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('notes')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        uploaded_by: user.id,
        is_published: false,
        download_count: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/notes');
    return { success: true, data: formatResponse(data) as Note };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create note' };
  }
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<ActionResult<Note>> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    // Check if user owns the note or is admin
    if (user.role !== 'admin') {
      const { data: existingNote } = await supabase
        .from('notes')
        .select('uploaded_by')
        .eq('id', id)
        .single();

      if (existingNote?.uploaded_by !== user.id) {
        throw new Error('You can only edit your own notes');
      }
    }

    const { data, error } = await supabase
      .from('notes')
      .update(toSnakeCase(input as unknown as Record<string, unknown>))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/notes');
    revalidatePath(`/admin/notes/${id}`);
    return { success: true, data: formatResponse(data) as Note };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update note' };
  }
}

export async function deleteNote(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/notes');
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete note' };
  }
}

export async function publishNote(id: string): Promise<ActionResult<Note>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('notes')
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/notes');
    return { success: true, data: formatResponse(data) as Note };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to publish note' };
  }
}

export async function incrementNoteDownload(id: string): Promise<ActionResult<Note>> {
  try {
    const supabase = createAdminClient();

    // Get current count
    const { data: note } = await supabase
      .from('notes')
      .select('download_count')
      .eq('id', id)
      .single();

    const newCount = (note?.download_count || 0) + 1;

    const { data, error } = await supabase
      .from('notes')
      .update({ download_count: newCount })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: formatResponse(data) as Note };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to increment download count' };
  }
}
