'use client';

import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import { updateCategory } from '@/app/actions/admin';

interface EditCategoryButtonProps {
  category: any;
}

export default function EditCategoryButton({ category }: EditCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(category.name);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateCategory(category.id, formData);
    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center text-xs px-3 py-1.5 rounded-lg font-medium transition bg-amber-50 text-amber-600 hover:bg-amber-100"
      >
        <Edit className="w-3 h-3 mr-1" /> Sửa
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden relative">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa danh mục</h2>
              <button type="button" onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Tên danh mục..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm text-gray-900"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-sky-800 transition flex items-center gap-2"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
