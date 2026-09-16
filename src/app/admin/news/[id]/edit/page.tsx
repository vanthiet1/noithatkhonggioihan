import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ChevronLeft, Pencil } from 'lucide-react';
import EditNewsForm from './EditNewsForm';
import { notFound } from 'next/navigation';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: newsItem } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (!newsItem) {
    notFound();
  }

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
            <Pencil className="w-6 h-6 text-sky-600" /> Sửa bài viết
          </h1>
          <p className="text-gray-500 text-sm mt-1">Cập nhật nội dung bài viết tin tức.</p>
        </div>
      </div>

      <EditNewsForm initialData={newsItem} />
    </div>
  );
}
