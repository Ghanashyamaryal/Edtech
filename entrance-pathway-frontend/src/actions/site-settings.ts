'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { formatResponse, type ActionResult } from './utils';
import { sendContactMessageToAdmin } from './email';

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  mapUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ============ CONTACT INFO ============

export async function getContactInfo(): Promise<ActionResult<ContactInfo>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found — return defaults
        return {
          success: true,
          data: {
            id: '',
            email: 'itproentrance@gmail.com',
            phone: '+977 9860120739',
            address: 'Kathmandu, Nepal',
            workingHours: 'Sun - Fri: 9AM - 6PM',
          },
        };
      }
      throw new Error(error.message);
    }

    return { success: true, data: formatResponse(data) as ContactInfo };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch contact info' };
  }
}

export async function updateContactInfo(
  input: Omit<ContactInfo, 'id'>
): Promise<ActionResult<ContactInfo>> {
  try {
    const supabase = createAdminClient();

    // Check if a row exists
    const { data: existing } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .single();

    let data;
    let error;

    if (existing) {
      // Update existing row
      const result = await supabase
        .from('contact_info')
        .update({
          email: input.email,
          phone: input.phone,
          address: input.address,
          working_hours: input.workingHours,
          map_url: input.mapUrl || null,
          facebook_url: input.facebookUrl || null,
          instagram_url: input.instagramUrl || null,
          youtube_url: input.youtubeUrl || null,
        })
        .eq('id', existing.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new row
      const result = await supabase
        .from('contact_info')
        .insert({
          email: input.email,
          phone: input.phone,
          address: input.address,
          working_hours: input.workingHours,
          map_url: input.mapUrl || null,
          facebook_url: input.facebookUrl || null,
          instagram_url: input.instagramUrl || null,
          youtube_url: input.youtubeUrl || null,
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw new Error(error.message);

    revalidatePath('/contact');
    revalidatePath('/admin/settings');
    return { success: true, data: formatResponse(data) as ContactInfo };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update contact info' };
  }
}

// ============ CONTACT MESSAGES ============

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ActionResult<ContactMessage>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        is_read: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Send email notification to admin (non-blocking)
    sendContactMessageToAdmin(input).catch(() => {});

    return { success: true, data: formatResponse(data) as ContactMessage };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit message' };
  }
}

export async function getContactMessages(): Promise<ActionResult<ContactMessage[]>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      success: true,
      data: (data || []).map((row) => formatResponse(row) as ContactMessage),
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch messages' };
  }
}

export async function markMessageRead(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw new Error(error.message);

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to mark message as read' };
  }
}

export async function deleteContactMessage(id: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete message' };
  }
}
