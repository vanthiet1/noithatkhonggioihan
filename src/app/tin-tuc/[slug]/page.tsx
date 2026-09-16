import { cache } from 'react';
import type { Metadata } from 'next';
import { getPublicClient } from '@/utils/supabase/public';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight, Home, Phone, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SidebarCategories from '@/components/SidebarCategories';

export const revalidate = 3600;

const getNewsItem = cache(async (slug: string) => {
  const supabase = getPublicClient();
  const now = new Date().toISOString();
  const { data: newsItems } = await supabase
    .from('news')
    .select('*')
    .ilike('link', `%${slug}%`)
    .eq('status', 'published')
    .lte('published_at', now)
    .limit(1);
  return newsItems?.[0] || null;
});

export async function generateStaticParams() {
  const supabase = getPublicClient();
  const { data: news } = await supabase.from('news').select('link');
  return (news || [])
    .map(n => {
      const slug = n.link ? n.link.split('/').filter(Boolean).pop() : '';
      return slug ? { slug } : null;
    })
    .filter(Boolean) as { slug: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsItem(slug);

  if (!news) return {};

  const title = news.seo_title || news.title;
  const description = news.seo_description || news.excerpt || undefined;

  return {
    title,
    description,
    keywords: news.seo_keyword || undefined,
    openGraph: {
      title,
      description,
      images: news.image_url ? [{ url: news.image_url, width: 1200, height: 630, alt: news.title }] : [],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/tin-tuc/${slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/tin-tuc/${slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    notFound();
  }

  // Replace &nbsp; with normal spaces so text wraps correctly on mobile
  const sanitizedContent = (newsItem.content || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ');

  const supabase = getPublicClient();

  const now = new Date().toISOString();
  // Chạy song song sản phẩm sidebar và danh mục
  const [{ data: sidebarProducts }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, image_url')
      .eq('status', 'published')
      .lte('published_at', now)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('categories')
      .select('id, name, slug')
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition flex items-center">
            <Home className="w-4 h-4 mr-1" /> Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/tin-tuc" className="hover:text-primary transition">
            Tin Tức
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 truncate max-w-xs">{newsItem.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN CONTENT (LEFT) */}
          <div className="lg:col-span-3 min-w-0">
            <article className="bg-white px-2 py-4 sm:p-6 md:p-10 lg:p-12 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">TIN TỨC</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {newsItem.title}
              </h1>
              
              <div className="flex items-center text-xs text-gray-400 uppercase tracking-wider font-semibold mb-8 pb-8 border-b border-gray-100">
                POSTED ON {new Date(newsItem.published_at || newsItem.created_at).toLocaleDateString('vi-VN')} BY ADMIN
              </div>

              {/* FEATURED IMAGE REMOVED PER USER REQUEST */}
              
              {newsItem.excerpt && (
                <div className="text-lg text-black font-medium italic mb-8 border-l-4 border-secondary pl-4">
                  {newsItem.excerpt}
                </div>
              )}
              
              <div 
                className="blog-content text-black w-full"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </article>
          </div>

          {/* SIDEBAR (RIGHT) */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Consultation Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-xl font-bold text-primary mb-4">Cần tư vấn?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Nhân viên Nội thất không giới hạn đến đo đạc và tư vấn tận nhà miễn phí.
              </p>
              <a href="tel:0766444789" 
                className="flex items-center justify-center w-full bg-primary text-white font-bold py-3 px-4 rounded-xl mb-3 hover:bg-sky-800 transition"
               rel="nofollow">
                <Phone className="w-5 h-5 mr-2" /> 0766.444.789
              </a>
              <a 
                href="https://zalo.me/0766444789" 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className="flex items-center justify-center w-full bg-white text-sky-500 font-bold py-3 px-4 rounded-xl border border-sky-500 hover:bg-sky-50 transition"
              >
                <MessageCircle className="w-5 h-5 mr-2" /> Nhắn Zalo
              </a>
            </div>

            {/* Products Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase flex items-center">
                SẢN PHẨM
              </h3>
              <div className="w-12 h-1 bg-secondary mb-6"></div>
              <div className="space-y-4">
                {sidebarProducts?.map(prod => (
                  <Link href={`/danh-muc-san-pham/${prod.slug}`} key={prod.id} className="flex gap-4 group items-center">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image 
                        src={prod.image_url || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=150&q=80'} 
                        alt={prod.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium text-gray-700 group-hover:text-primary transition line-clamp-2">
                        {prod.name}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <SidebarCategories />

          </div>
        </div>
      </div>
    </div>
  );
}
