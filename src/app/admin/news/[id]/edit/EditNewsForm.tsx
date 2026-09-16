'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { updateNews, uploadEditorImage } from '@/app/actions/admin';
import dynamic from 'next/dynamic';
import TagsInput from '@/components/TagsInput';
import PublishSchedule from '@/components/PublishSchedule';
import 'react-quill-new/dist/quill.snow.css';
import Image from 'next/image';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p className="text-gray-400 py-4">Đang tải trình soạn thảo...</p> }) as any;
import { formatHTML } from '@/utils/formatHtml';

export default function EditNewsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(initialData.content || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content || content === '<p><br></p>') {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set('content', content);
    
    const result = await updateNews(initialData.id, formData);
    
    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/admin/news');
    }
  };

  const quillRef = useRef<any>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const altText = prompt('Nhập thẻ alt cho hình ảnh (dùng cho SEO):') || '';
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadEditorImage(formData);
        
        if (res.url) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', res.url);
            if (altText) {
              quill.formatText(range.index, 1, 'alt', altText);
            }
            quill.setSelection(range.index + 1);
          }
        } else {
          alert('Lỗi tải ảnh lên: ' + res.error);
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tiêu đề bài viết *</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={initialData.title}
              placeholder="Nhập tiêu đề..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện bài viết</label>
            {initialData.image_url && (
              <div className="mb-2 relative w-full h-24 rounded-xl overflow-hidden border border-gray-200">
                <Image src={initialData.image_url} alt="Current image" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tóm tắt (Excerpt) *</label>
            <textarea
              name="excerpt"
              required
              rows={3}
              defaultValue={initialData.excerpt}
              placeholder="Đoạn mô tả ngắn hiển thị ở trang chủ..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
            ></textarea>
          </div>
        </div>

        {/* SEO Fields */}
        <div className="pt-6 mt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cấu hình SEO</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tiêu đề SEO (SEO Title)</label>
              <input
                type="text"
                name="seo_title"
                defaultValue={initialData.seo_title}
                placeholder="VD: Thi công nội thất đà nẵng trọn gói uy tín"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mô tả SEO (SEO Description)</label>
              <textarea
                name="seo_description"
                rows={3}
                defaultValue={initialData.seo_description}
                placeholder="VD: Cập nhật xu hướng thi công nội thất mới nhất..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Từ khóa SEO (SEO Keywords)</label>
              <TagsInput
                name="seo_keyword"
                initialTags={initialData.seo_keyword || ''}
                placeholder="Nhập từ khóa và nhấn Enter hoặc phẩy (,) để thêm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 flex flex-col pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Nội dung chi tiết *</label>
            <button 
              type="button" 
              onClick={() => {
                if (!isHtmlMode) {
                  setContent(formatHTML(content));
                }
                setIsHtmlMode(!isHtmlMode);
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              {isHtmlMode ? 'Chuyển sang Trình soạn thảo' : 'Chỉnh sửa HTML (Source)'}
            </button>
          </div>
          <div className="bg-white border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: '600px' }}>
            {isHtmlMode ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[550px] p-4 font-mono text-sm text-gray-900 bg-gray-50 focus:outline-none"
                placeholder="<p>Nhập mã HTML tại đây...</p>"
              />
            ) : (
              <ReactQuill 
                ref={quillRef as any}
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                className="h-[550px] text-gray-900"
                placeholder="Viết nội dung bài blog của bạn ở đây..."
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <PublishSchedule 
          initialStatus={initialData.status || 'published'} 
          initialPublishedAt={initialData.published_at || null} 
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50 flex items-center shadow-sm"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
}
