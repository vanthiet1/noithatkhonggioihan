import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/SafeImage';
import { ArrowRight, Calendar } from 'lucide-react';
import { getPublicClient } from '@/utils/supabase/public';
import SidebarCategories from '@/components/SidebarCategories';
import { SEO_TIN_TUC } from '@/lib/seo';

export const metadata: Metadata = SEO_TIN_TUC;
export const revalidate = 3600;

export default async function NewsPage() {
  const supabase = getPublicClient();

  const [{ data: news }, { data: sidebarProducts }] = await Promise.all([
    supabase
      .from('news')
      .select('id, title, link, excerpt, image_url, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('id, name, slug, image_url, original_price, sale_price')
      .limit(4)
  ]);

  const getLocalSlug = (url: string | null) => {
    if (!url) return '#';
    // Link might be full URL or relative like 'slug-name/'
    const slug = url.split('/').filter(Boolean).pop();
    return `/tin-tuc/${slug}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[400px] py-16 md:py-0 bg-gray-900 flex items-center">
        <Image 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          alt="Tin tức nội thất" 
          fill 
          className="object-cover opacity-40" 
          priority
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/30">Nội Dung Hữu Ích</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">Tin Tức & Kiến Thức Nội Thất</h1>
            <p className="text-lg text-gray-200 leading-relaxed">
              Khám phá kinh nghiệm thi công, xu hướng thiết kế, mẹo lựa chọn vật liệu và các công trình thực tế về cửa lưới chống muỗi, tấm ốp tường Nano, giấy dán tường, rèm cửa và tranh dán tường tại Đà Nẵng. Cập nhật những giải pháp hữu ích giúp bạn lựa chọn dịch vụ phù hợp và tối ưu chi phí cho mọi công trình.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT COLUMN: News List */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {news && news.length > 0 ? news.map((item) => (
             <article key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col group">
                {/* Thumb nếu có */}
                {item.image_url && (
                  <Link href={getLocalSlug(item.link)} className="relative h-48 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-4 sm:mb-6 overflow-hidden block rounded-t-2xl">
                     <SafeImage src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" widthParam={600} />
                  </Link>
                )}
                
                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">TIN TỨC</span>
                <h2 className="font-extrabold text-xl text-black mb-3 line-clamp-3 hover:text-primary transition leading-tight">
                   <Link href={getLocalSlug(item.link)}>{item.title}</Link>
                </h2>
                <p className="text-black mb-6 flex-grow line-clamp-3 leading-relaxed">{item.excerpt}</p>
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
                   <span className="text-sm font-medium text-gray-500">
                     {new Date(item.created_at).toLocaleDateString('vi-VN')}
                   </span>
                   <Link href={getLocalSlug(item.link)} className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-primary transition group/link">
                      Đọc thêm <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </article>
           )) : (
             <p className="col-span-full text-center text-gray-500">Chưa có bài viết nào.</p>
           )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Widget: Cần tư vấn? */}
            <div className="bg-white rounded-3xl p-8 border border-sky-50 shadow-[0_10px_40px_-15px_rgba(0,168,232,0.15)] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
              <h3 className="text-3xl font-bold text-primary mb-4 relative z-10">Cần tư vấn?</h3>
              <p className="text-sky-900/70 mb-8 relative z-10 text-sm leading-relaxed">
                Nhân viên Nội thất không giới hạn đến đo đạc và tư vấn tận nhà miễn phí
              </p>
              
              <div className="space-y-3 relative z-10">
                <a href="tel:+84766444789" className="bg-primary hover:bg-sky-800 text-white px-6 py-3.5 rounded-2xl font-bold transition flex items-center justify-center shadow-lg shadow-primary/20" rel="nofollow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  0766.444.789
                </a>
                <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-white border-2 border-primary text-primary hover:bg-sky-50 px-6 py-3.5 rounded-2xl font-bold transition flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Nhắn Zalo
                </a>
              </div>
            </div>

            {/* Widget: Sản Phẩm */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase border-b border-gray-100 pb-4">Sản Phẩm</h3>
              <div className="space-y-4">
                {sidebarProducts && sidebarProducts.map(p => (
                  <Link key={p.id} href={`/danh-muc-san-pham/${p.slug}`} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative bg-gray-100 shrink-0">
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-110 transition" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">...</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 group-hover:text-primary transition">{p.name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-bold text-red-600 text-sm">{p.sale_price || p.original_price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget: Danh Mục Sản Phẩm */}
            <SidebarCategories />

          </div>
        </div>
      </div>
    </div>
  );
}
