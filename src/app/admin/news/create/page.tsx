import CreateNewsForm from './CreateNewsForm';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export default function CreateNewsPage() {
  return (
    <div className="w-full max-w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/admin/news" 
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Viết bài mới
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sử dụng trình soạn thảo chuẩn SEO để tạo nội dung hấp dẫn.</p>
        </div>
      </div>

      <CreateNewsForm />
    </div>
  );
}
