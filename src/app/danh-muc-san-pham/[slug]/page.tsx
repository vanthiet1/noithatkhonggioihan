import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, CheckCircle2 } from 'lucide-react';
import { getPublicClient } from '@/utils/supabase/public';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductTabs from '@/components/ProductTabs';
import ProductGallery from '@/components/ProductGallery';

export const revalidate = 3600;

const getProduct = cache(async (slug: string) => {
  const supabase = getPublicClient();
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug), sub_categories(name, slug, category_id)')
    .eq('slug', slug)
    .single();
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return {};

  const title = product.seo_title || product.name;
  const description = product.seo_description || product.description || `Mua ngay ${product.name} với giá tốt nhất tại Nội Thất Không Giới Hạn Đà Nẵng.`;

  return {
    title,
    description,
    keywords: product.seo_keyword || undefined,
    openGraph: {
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    }
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const supabase = getPublicClient();

  // Chạy song song các query reviews, sản phẩm liên quan và category cha
  const [reviewsRes, relatedRes, parentCatRes] = await Promise.all([
    supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false }),
    product.sub_category_id
      ? supabase
          .from('products')
          .select('id, name, slug, image_url, original_price, sale_price, categories(name)')
          .eq('sub_category_id', product.sub_category_id)
          .neq('id', product.id)
          .limit(4)
      : product.category_id
      ? supabase
          .from('products')
          .select('id, name, slug, image_url, original_price, sale_price, categories(name)')
          .eq('category_id', product.category_id)
          .neq('id', product.id)
          .limit(4)
      : Promise.resolve({ data: [] }),
    product.sub_categories?.category_id
      ? supabase
          .from('categories')
          .select('name, slug')
          .eq('id', product.sub_categories.category_id)
          .single()
      : Promise.resolve({ data: null })
  ]);

  const reviews = reviewsRes.data;
  let relatedProducts = relatedRes.data || [];
  let parentCategory: any = parentCatRes?.data || product.categories || null;
  let subCategory: any = product.sub_categories || null;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 flex flex-wrap items-center gap-2">
           <Link href="/" className="hover:text-primary transition">Trang chủ</Link>
           <span className="text-gray-400">/</span>
           {parentCategory && (
             <>
               <Link href={`/danh-muc/${parentCategory.slug}`} className="hover:text-primary transition">{parentCategory.name}</Link>
               <span className="text-gray-400">/</span>
             </>
           )}
           {subCategory && (
             <>
               <Link href={`/danh-muc/${subCategory.slug}`} className="hover:text-primary transition">{subCategory.name}</Link>
               <span className="text-gray-400">/</span>
             </>
           )}
           <span className="text-primary font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Product Image Gallery */}
           <ProductGallery 
             mainImage={product.image_url} 
             galleryImages={product.gallery_images} 
             productName={product.name} 
           />

           {/* Product Info */}
           <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">{product.name}</h1>
              
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {product.sale_price || product.original_price ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-primary">
                      {product.sale_price || product.original_price}
                    </span>
                    {product.original_price && product.sale_price && product.original_price !== product.sale_price && (
                      <span className="text-lg text-gray-400 line-through font-medium">
                        {product.original_price}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-primary">
                    Liên hệ nhận báo giá
                  </span>
                )}
              </div>

              <div className="w-20 h-1 bg-secondary mb-6"></div>
              
              {/* Optional short intro text can go here, but we omit the long HTML description to avoid breaking the layout */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thiết kế hiện đại, chất liệu cao cấp, thi công chuyên nghiệp. Chúng tôi cam kết mang đến không gian sống hoàn hảo nhất cho bạn.
              </p>

              <div className="bg-slate-50 p-6 rounded-xl border border-gray-100 mb-6">
                 <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                   <span className="text-xl mr-2">📌</span> NHẬN BÁO GIÁ MIỄN PHÍ
                 </h3>
                 <ul className="space-y-3">
                   <li className="flex items-center text-gray-700 font-medium text-sm">
                     <CheckCircle2 className="w-5 h-5 text-secondary mr-3 shrink-0" /> Khảo sát tận nơi tại Đà Nẵng
                   </li>
                   <li className="flex items-center text-gray-700 font-medium text-sm">
                     <CheckCircle2 className="w-5 h-5 text-secondary mr-3 shrink-0" /> Báo giá theo kích thước thực tế
                   </li>
                   <li className="flex items-center text-gray-700 font-medium text-sm">
                     <CheckCircle2 className="w-5 h-5 text-secondary mr-3 shrink-0" /> Không phát sinh chi phí
                   </li>
                 </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                 <a href="tel:+84766444789" rel="nofollow" className="flex-1 bg-primary text-white text-center py-4 rounded-xl font-bold hover:bg-sky-800 transition flex items-center justify-center shadow-md">
                   <Phone className="w-5 h-5 mr-2" />
                   GỌI ĐIỆN TƯ VẤN NGAY
                 </a>
                 <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="flex-1 bg-white border-2 border-primary text-primary text-center py-4 rounded-xl font-bold hover:bg-sky-50 transition shadow-md flex items-center justify-center">
                   CHAT ZALO
                 </a>
              </div>
           </div>
        </div>

        {/* Tabs: Mô tả / Đánh giá */}
        <ProductTabs product={product} reviews={reviews || []} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-primary uppercase mb-8">SẢN PHẨM TƯƠNG TỰ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
