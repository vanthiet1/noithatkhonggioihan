'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, uploadEditorImage } from '@/app/actions/admin';
import dynamic from 'next/dynamic';
import TagsInput from '@/components/TagsInput';
import 'react-quill-new/dist/quill.snow.css';
import { formatHTML } from '@/utils/formatHtml';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <p className="text-gray-400 py-4">Đang tải trình soạn thảo...</p> 
}) as any;

type Category = { id: string; name: string };
type SubCategory = { id: string; name: string; category_id: string };

export default function CreateProductForm({
  categories,
  subCategories
}: {
  categories: Category[];
  subCategories: SubCategory[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id === selectedCategory
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set('description', description);
    
    const result = await createProduct(formData);
    
    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/admin/products');
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
            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="VD: Cửa lưới chống muỗi mở lùa..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-primary hover:file:bg-sky-100 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Danh mục chính</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-gray-50"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Danh mục con *</label>
            <select
              name="sub_category_id"
              required
              disabled={!selectedCategory}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-gray-50 disabled:opacity-50"
            >
              <option value="">-- Chọn danh mục con --</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Giá gốc (VNĐ)</label>
            <input
              type="text"
              name="original_price"
              placeholder="VD: 500.000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
            />
            <p className="text-xs text-gray-500 italic mt-1">( Giá cuối phụ thuộc kích thước thực tế — báo giá miễn phí )</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Giá khuyến mãi (VNĐ)</label>
            <input
              type="text"
              name="sale_price"
              placeholder="VD: 350.000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
            />
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
                placeholder="VD: Cửa Lưới Chống Muỗi Cao Cấp | Nội Thất Không Giới Hạn"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mô tả SEO (SEO Description)</label>
              <textarea
                name="seo_description"
                rows={3}
                placeholder="VD: Chuyên cung cấp và thi công cửa lưới chống muỗi chất lượng cao..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Từ khóa SEO (SEO Keywords)</label>
              <TagsInput 
                name="seo_keyword" 
                placeholder="Nhập từ khóa và nhấn Enter hoặc phẩy (,) để thêm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 flex flex-col pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Mô tả sản phẩm</label>
            <button 
              type="button" 
              onClick={() => {
                if (!isHtmlMode) {
                  setDescription(formatHTML(description));
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-[550px] p-4 font-mono text-sm text-gray-900 bg-gray-50 focus:outline-none"
                placeholder="<p>Nhập mã HTML tại đây...</p>"
              />
            ) : (
              <ReactQuill 
                ref={quillRef as any}
                theme="snow" 
                value={description} 
                onChange={setDescription} 
                modules={modules}
                className="h-[550px] text-gray-900"
                placeholder="Nhập mô tả sản phẩm (hỗ trợ chèn ảnh, video, link)..."
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-sky-800 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </form>
  );
}
