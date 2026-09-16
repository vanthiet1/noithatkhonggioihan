'use client';

import { useState, useRef } from 'react';
import { Edit, X } from 'lucide-react';
import { updateProduct, uploadEditorImage } from '@/app/actions/admin';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { formatHTML } from '@/utils/formatHtml';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <p className="text-gray-400 py-4">Đang tải trình soạn thảo...</p> 
}) as any;

interface EditProductButtonProps {
  product: any;
  categories: any[];
  subCategories: any[];
}

export default function EditProductButton({ product, categories, subCategories }: EditProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState(formatHTML(product.description || ''));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set('description', description);
    
    const res = await updateProduct(product.id, formData);
    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
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

  const modules = {
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
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
      >
        Sửa
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col overflow-hidden relative">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-grow overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                  <input 
                    name="name" 
                    required 
                    defaultValue={product.name}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Danh mục con *</label>
                  <select 
                    name="sub_category_id" 
                    required 
                    defaultValue={product.sub_category_id}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                  >
                    <option value="">Chọn danh mục con</option>
                    {categories.map(cat => (
                      <optgroup key={cat.id} label={cat.name}>
                        {subCategories.filter(sub => sub.category_id === cat.id).map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Giá gốc (VNĐ)</label>
                  <input 
                    name="original_price" 
                    defaultValue={product.original_price}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                  <p className="text-xs text-gray-500 italic mt-1">( Giá cuối phụ thuộc kích thước thực tế — báo giá miễn phí )</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                  <input 
                    name="sale_price" 
                    defaultValue={product.sale_price}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cấu hình SEO</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Tiêu đề SEO (SEO Title)</label>
                    <input
                      type="text"
                      name="seo_title"
                      defaultValue={product.seo_title}
                      placeholder="VD: Cửa Lưới Chống Muỗi Cao Cấp | Nội Thất Không Giới Hạn"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Mô tả SEO (SEO Description)</label>
                    <textarea
                      name="seo_description"
                      rows={3}
                      defaultValue={product.seo_description}
                      placeholder="VD: Chuyên cung cấp và thi công cửa lưới chống muỗi chất lượng cao..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Từ khóa SEO (SEO Keywords)</label>
                    <input
                      type="text"
                      name="seo_keyword"
                      defaultValue={product.seo_keyword}
                      placeholder="VD: cửa lưới chống muỗi, cua luoi chong muoi da nang, nội thất đà nẵng"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Hình ảnh mới (Để trống nếu giữ nguyên)</label>
                <div className="flex gap-4 items-center">
                  {product.image_url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-gray-200 flex-shrink-0">
                      <Image src={product.image_url} alt="Current" fill className="object-cover" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition cursor-pointer"
                  />
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

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-sky-800 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50 flex items-center">
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

