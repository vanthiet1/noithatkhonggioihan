'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { UploadCloud, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { saveSiteSetting } from '@/app/actions/settings';

export default function SettingsPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage_about_image')
      .single();

    if (data && !error) {
      setImageUrl(data.value);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File ảnh quá lớn. Vui lòng chọn ảnh < 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage-about-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(urlData.publicUrl);
      alert('Đã tải ảnh lên! Hãy bấm Lưu Cài Đặt.');
    } catch (err: any) {
      console.error(err);
      alert('Lỗi khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) {
      alert('Vui lòng chọn ảnh trước khi lưu!');
      return;
    }

    setIsSaving(true);
    try {
      await saveSiteSetting('homepage_about_image', imageUrl);
      alert('Đã lưu cấu hình thành công!');
    } catch (err: any) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu cài đặt.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" /> Cài đặt chung
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Quản lý các hình ảnh và thông tin chung trên website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Lưu Cài Đặt
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-6">
          Ảnh Trang Chủ (Phần "Về Chúng Tôi")
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Preview */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative group transition hover:border-primary/50">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Homepage About Image"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center text-gray-400 p-6">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chưa có hình ảnh</p>
                </div>
              )}

              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg hover:bg-gray-50 transition transform hover:scale-105">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {isUploading ? 'Đang tải lên...' : 'Thay đổi ảnh'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Khuyến nghị: Ảnh nên có tỷ lệ 4:3 (ví dụ 800x600px), dung lượng dưới 5MB.
            </p>
          </div>

          {/* Guidelines */}
          <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Hướng dẫn thay ảnh:</h3>
            <ul className="text-sm text-gray-600 space-y-3 list-disc pl-5">
              <li>Nhấn vào <strong>"Thay đổi ảnh"</strong> (hoặc rê chuột vào ảnh) để tải ảnh mới lên.</li>
              <li>Ảnh sẽ tự động tải lên máy chủ Supabase.</li>
              <li>Bấm nút <strong>"Lưu Cài Đặt"</strong> ở góc phải phía trên cùng để xác nhận cập nhật cho trang web.</li>
              <li>Bức ảnh này sẽ hiển thị ở ngay trang chủ, phần giới thiệu "Thi Công Nội Thất Đà Nẵng Chuyên Nghiệp".</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
