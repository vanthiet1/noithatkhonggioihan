'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitReview(prevState: any, formData: FormData) {
  const productId = formData.get('productId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const content = (formData.get('content') as string)?.trim();
  const authorName = (formData.get('authorName') as string)?.trim();
  const authorEmail = (formData.get('authorEmail') as string)?.trim();

  if (!productId || !rating || !content || !authorName || !authorEmail) {
    return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' };
  }

  if (rating < 1 || rating > 5) {
    return { error: 'Đánh giá sao không hợp lệ.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    rating,
    content,
    author_name: authorName,
    author_email: authorEmail,
    is_approved: false // Pending approval
  });

  if (error) {
    return { error: 'Đã xảy ra lỗi khi gửi đánh giá: ' + error.message };
  }

  return { success: true };
}
