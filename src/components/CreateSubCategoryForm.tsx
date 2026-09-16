'use client';

import { useState, useRef } from 'react';
import { createSubCategory } from '@/app/actions/admin';
import PublishSchedule from '@/components/PublishSchedule';
import { Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CreateSubCategoryFormProps {
  categories: Category[];
}

export default function CreateSubCategoryForm({ categories }: CreateSubCategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createSubCategory(formData);
    
    setLoading(false);
    
    if (result.error) {
      alert(`Lỗi: ${result.error}`);
    } else {
      alert('Thêm danh mục con thành công!');
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <select
          name="category_id"
          required
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-gray-50 min-w-[200px] text-gray-900"
        >
          <option value="">-- Chọn danh mục cha --</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          required
          placeholder="Tên danh mục con..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-gray-50 text-gray-900"
        />
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          name="description"
          placeholder="Mô tả ngắn gọn..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-gray-50 text-gray-900"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-gray-50 text-gray-900"
        />
      </div>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <PublishSchedule />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-white px-8 py-2.5 rounded-xl font-medium text-sm hover:bg-sky-800 transition h-fit mb-6 flex items-center justify-center min-w-[120px] shadow-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Thêm'}
        </button>
      </div>
    </form>
  );
}
