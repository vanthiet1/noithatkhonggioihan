'use server'

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export async function saveSiteSetting(key: string, value: string) {
  // Simple check to ensure user is logged in
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';
  
  if (!isAdmin) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ 
      key, 
      value,
      description: 'Hình ảnh hiển thị ở phần Về Chúng Tôi trên trang chủ',
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving setting:', error);
    throw new Error(error.message);
  }
  
  revalidatePath('/');
  return { success: true };
}
