'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  // formData có thể null nếu gọi sai cách - guard check
  if (!formData) {
    return { error: 'Dữ liệu form không hợp lệ.' };
  }

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return { error: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.' };
  }

  if (username === validUsername && password === validPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    redirect('/admin');
  } else {
    // Nhập sai → redirect về trang chủ
    redirect('/');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}
