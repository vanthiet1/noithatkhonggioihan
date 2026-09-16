'use client';

import { useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Star, CheckCircle } from 'lucide-react';
import { submitReview } from '@/app/actions/review';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-sky-800 text-white font-bold py-2.5 px-8 rounded transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'ĐANG GỬI...' : 'GỬI ĐI'}
    </button>
  );
}

interface ProductTabsProps {
  product: any;
  reviews: any[];
}

export default function ProductTabs({ product, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'review'>('desc');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const [state, formAction] = useActionState(submitReview, null);
  
  // Local state to hide form after success
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsSuccess(true);
      setRating(0);
    }
  }, [state]);

  // Fix lazy-loaded images from scraped WordPress content
  useEffect(() => {
    if (activeTab === 'desc' && product?.description) {
      const timer = setTimeout(() => {
        const images = document.querySelectorAll('.prose img');
        images.forEach((img) => {
          const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-srcset');
          if (dataSrc) {
            // If data-srcset is a URL, split it if necessary. Usually data-src is clean.
            const cleanUrl = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || (img.getAttribute('data-srcset')?.split(' ')[0]);
            if (cleanUrl) {
              img.setAttribute('src', cleanUrl);
            }
            img.classList.remove('lazyload');
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, product]);

  const approvedReviews = reviews.filter(r => r.is_approved);

  return (
    <div className="mt-16 border border-gray-200 rounded-2xl">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 bg-slate-50 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('desc')}
          className={`px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${
            activeTab === 'desc' 
              ? 'bg-white border-t-2 border-primary text-primary' 
              : 'text-gray-500 hover:text-primary'
          }`}
        >
          MÔ TẢ
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${
            activeTab === 'review' 
              ? 'bg-white border-t-2 border-primary text-primary' 
              : 'text-gray-500 hover:text-primary'
          }`}
        >
          ĐÁNH GIÁ ({approvedReviews.length})
        </button>
      </div>

      {/* Tabs Content */}
      <div className="p-0 sm:p-6 md:p-10 bg-white min-h-[400px]">
        
        {/* Description Tab */}
        {activeTab === 'desc' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin chi tiết {product.name}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:my-6 [&>h1]:text-center [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:my-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:my-3 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4">
              {product.description ? (
                 <div className="w-full" dangerouslySetInnerHTML={{ __html: (product.description || '').replace(/&nbsp;/gi, ' ').replace(/\u00a0/g, ' ') }} />
              ) : (
                <>
                  <p>Sản phẩm <strong>{product.name}</strong> được cung cấp và thi công trực tiếp bởi Nội Thất Không Giới Hạn tại khu vực Đà Nẵng, Quảng Nam và các tỉnh lân cận.</p>
                  <p>Với chất liệu cao cấp, độ bền vượt trội và tính thẩm mỹ cao, đây chắc chắn là sự lựa chọn hoàn hảo để nâng tầm không gian sống của bạn.</p>
                  <ul>
                    <li>✅ Tư vấn mẫu mã và thiết kế hoàn toàn miễn phí.</li>
                    <li>✅ Mang mẫu catalogue đến tận nhà để quý khách lựa chọn.</li>
                    <li>✅ Đội ngũ thợ thi công lành nghề, tỉ mỉ, dọn dẹp sạch sẽ sau khi hoàn thiện.</li>
                    <li>✅ Chế độ bảo hành dài hạn lên đến 5 năm giúp quý khách an tâm sử dụng.</li>
                  </ul>
                  <p>Để nhận báo giá chính xác nhất theo kích thước thực tế công trình, quý khách vui lòng liên hệ Hotline hoặc Zalo. Chúng tôi luôn sẵn sàng hỗ trợ 24/7!</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'review' && (
          <div>
            <div className={`grid grid-cols-1 gap-12 ${approvedReviews.length > 0 ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
              
              {/* Danh sách đánh giá */}
              {approvedReviews.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {approvedReviews.length} đánh giá cho {product.name}
                  </h3>
                  
                  <div className="space-y-6">
                    {approvedReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 uppercase">
                            {review.author_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{review.author_name}</p>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2">{review.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form đánh giá */}
              <div className="border border-sky-200 p-6 md:p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {approvedReviews.length > 0 ? `Thêm đánh giá cho "${product.name}"` : `Hãy là người đầu tiên nhận xét "${product.name}"`}
                </h3>
                <p className="text-sm text-gray-500 mb-6">Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu *</p>

                {isSuccess ? (
                  <div className="bg-sky-50 text-sky-700 border border-sky-200 p-6 rounded-lg text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-sky-500" />
                    <p className="font-bold text-lg">Gửi đánh giá thành công!</p>
                    <p className="text-sm mt-1">Đánh giá của bạn đang chờ quản trị viên phê duyệt. Cảm ơn bạn!</p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 text-sm text-sky-600 underline"
                    >
                      Gửi đánh giá khác
                    </button>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-4">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="rating" value={rating} />
                    
                    {state?.error && (
                      <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{state.error}</div>
                    )}

                    <div className="mb-4">
                      <label className="block font-bold text-gray-700 text-sm mb-2">Đánh giá của bạn *</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 text-sm mb-2">Đánh giá của bạn *</label>
                      <textarea
                        name="content"
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-900"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 text-sm mb-2">Tên *</label>
                        <input
                          type="text"
                          name="authorName"
                          required
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 text-sm mb-2">Email *</label>
                        <input
                          type="email"
                          name="authorEmail"
                          required
                          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                          title="Vui lòng nhập địa chỉ email hợp lệ"
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 pb-4">
                      <input type="checkbox" id="save-info" className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" />
                      <label htmlFor="save-info" className="text-sm text-gray-600">Lưu tên của tôi, email, và trang web trong trình duyệt này cho lần bình luận kế tiếp của tôi.</label>
                    </div>

                    <SubmitButton />
                  </form>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
