'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateFeaturedProject } from '@/app/actions/admin';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function EditFeaturedProjectForm({ project, newsList }: { project: any, newsList: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(project.image_url);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateFeaturedProject(project.id, formData);
    
    if (result.error) {
      alert(result.error);
      setLoading(false);
    } else {
      alert('Cập nhật công trình thành công!');
      router.push('/admin/featured-projects');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">Tên công trình *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={project.title}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-gray-900"
              placeholder="Vd: Cửa Lưới Chống Muỗi Đà Nẵng"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">Địa điểm</label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={project.location}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-gray-900"
              placeholder="Vd: Công trình hoàn thiện tại Nam Hòa Xuân..."
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-1.5">Liên kết ngoài / Bài viết (Tùy chọn)</label>
            <input
              type="text"
              id="link"
              name="link"
              defaultValue={project.link || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white text-gray-900"
              placeholder="Vd: /danh-muc/cua-luoi-chong-muoi hoặc https://..."
            />
            <p className="text-xs text-gray-500 mt-1.5">Khi click "Xem Công Trình", sẽ chuyển hướng đến đường dẫn này.</p>
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-gray-700 mb-1.5">Ảnh công trình</span>
          <label htmlFor="image" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary transition-colors bg-gray-50 group relative cursor-pointer">
            <div className="space-y-2 text-center z-10">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative font-medium text-primary hover:text-sky-600">
                  Tải ảnh lên
                </span>
                <input id="image" name="image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                <p className="pl-1">hoặc kéo thả</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP tối đa 5MB</p>
            </div>
            
            {imagePreview && (
              <div className="absolute inset-0 z-20 bg-white rounded-xl overflow-hidden p-1">
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-100">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Thay đổi ảnh</span>
                  </div>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-sky-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {loading ? 'Đang lưu...' : 'Lưu công trình'}
        </button>
      </div>
    </form>
  );
}
