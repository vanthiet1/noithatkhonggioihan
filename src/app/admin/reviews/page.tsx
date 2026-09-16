import { createClient } from '@/utils/supabase/server';
import { Star, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { updateReviewStatus, deleteReview } from '@/app/actions/admin';
import DeleteButton from './DeleteButton';

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  
  // Fetch reviews with product details
  const { data: reviews } = await supabase
    .from('product_reviews')
    .select(`
      *,
      products (
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false });

  const total = reviews?.length || 0;
  const pending = reviews?.filter(r => !r.is_approved).length || 0;
  const approved = reviews?.filter(r => r.is_approved).length || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đánh giá</h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách đánh giá từ khách hàng cho các sản phẩm</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mr-4">
            <MessageSquare className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Tổng đánh giá</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mr-4">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chờ duyệt</p>
            <p className="text-2xl font-bold text-orange-600">{pending}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Đã duyệt</p>
            <p className="text-2xl font-bold text-green-600">{approved}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Khách hàng</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase min-w-[200px]">Nội dung & Đánh giá</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Thời gian</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews && reviews.length > 0 ? reviews.map((review: any) => (
              <tr key={review.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{review.author_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{review.author_email}</div>
                </td>
                <td className="px-6 py-4">
                  {review.products ? (
                    <a href={`/danh-muc-san-pham/${review.products.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium text-sm line-clamp-2">
                      {review.products.name}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-sm">Sản phẩm đã bị xóa</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm italic">"{review.content}"</p>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                  {new Date(review.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {review.is_approved ? 'Đã hiển thị' : 'Đang ẩn'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <form action={async () => {
                      'use server';
                      await updateReviewStatus(review.id, !review.is_approved);
                    }}>
                      <button type="submit" className={`text-xs px-3 py-1 rounded-lg font-medium transition ${review.is_approved ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                        {review.is_approved ? 'Ẩn đi' : 'Duyệt'}
                      </button>
                    </form>
                    <DeleteButton reviewId={review.id} />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Chưa có đánh giá nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
