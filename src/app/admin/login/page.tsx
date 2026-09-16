'use client'

import { useActionState, useEffect } from 'react';
import { login } from '@/app/actions/auth';
import { Lock, User } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-sky-800 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
    </button>
  );
}

export default function AdminLogin() {
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-center">
           <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Quản Trị Hệ Thống</h1>
        </div>
        
        <div className="p-8">
           <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Đăng nhập Admin</h2>
           
           {state?.error && (
             <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center font-medium border border-red-100">
               {state.error}
             </div>
           )}

           <form action={formAction} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="username"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-black" 
                    placeholder="Nhập tên đăng nhập" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-black" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
