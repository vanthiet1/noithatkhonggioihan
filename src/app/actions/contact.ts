'use server'
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitContact(prevState: any, formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !phone) {
    return { error: 'Vui lòng điền đầy đủ họ tên và số điện thoại.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('contacts').insert({ name, phone, message });

  if (error) return { error: 'Có lỗi xảy ra, vui lòng thử lại.' };

  revalidatePath('/admin/contacts');
  return { success: true };
}
