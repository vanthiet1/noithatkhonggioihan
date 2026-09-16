import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, FileText, Eye } from 'lucide-react';
import { deleteNews } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';
import StatusSelect from '@/components/StatusSelect';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data: newsList } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tin tức</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng: {newsList?.length || 0} bài viết</p>
        </div>
        <Link href="/admin/news/create" className="flex items-center bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-sky-800 transition shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase w-16">Ảnh</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tiêu đề</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Ngày đăng</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {newsList && newsList.length > 0 ? newsList.map((news) => (
              <tr key={news.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 relative">
                    {news.image_url && (
                      <Image src={news.image_url} alt={news.title} fill className="object-cover" />
                    )}
                    {!news.image_url && <FileText className="w-6 h-6 text-gray-300 m-auto mt-4" />}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="font-semibold text-gray-800 line-clamp-2 text-sm">{news.title}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{news.excerpt}</p>
                </td>
                <td className="px-6 py-3 text-gray-500 text-sm whitespace-nowrap">
                  {new Date(news.published_at || news.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-3">
                  {news.status === 'draft' ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium whitespace-nowrap">Bản nháp</span>
                  ) : news.published_at && new Date(news.published_at) > new Date() ? (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium flex items-center w-fit whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                      Hẹn giờ
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium whitespace-nowrap">Công khai</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <StatusSelect id={news.id} table="news" currentStatus={news.status || 'published'} />
                    <Link href={news.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs px-3 py-1.5 rounded-lg font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">
                      <Eye className="w-3 h-3 mr-1" /> Xem
                    </Link>
                    <Link href={`/admin/news/${news.id}/edit`} className="flex items-center text-xs px-3 py-1.5 rounded-lg font-medium bg-sky-50 text-sky-600 hover:bg-sky-100 transition">
                      <Pencil className="w-3 h-3 mr-1" /> Sửa
                    </Link>
                    <DeleteButton id={news.id} onDelete={deleteNews} confirmMessage="Bạn có chắc chắn muốn xóa bài viết tin tức này không? Hành động này không thể hoàn tác.">
                      <div className="flex items-center"><Trash2 className="w-3 h-3 mr-1" /> Xóa</div>
                    </DeleteButton>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Chưa có bài viết nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
