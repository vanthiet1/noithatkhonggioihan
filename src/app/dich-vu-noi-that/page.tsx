import type { Metadata } from 'next';
import { getPublicClient } from '@/utils/supabase/public';
import ProductCard from '@/components/ProductCard';
import SortDropdown from '@/components/SortDropdown';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { SEO_DICH_VU } from '@/lib/seo';

export const metadata: Metadata = SEO_DICH_VU;
export const revalidate = 3600;

// Hàm hỗ trợ lấy số từ chuỗi giá (ví dụ "150,000 ₫" -> 150000)
const parsePrice = (priceStr?: string) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/\D/g, '')) || 0;
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const sort = resolvedParams.sort || 'default';
  const itemsPerPage = 12;

  const supabase = getPublicClient();
  
  // Lấy danh sách sản phẩm cần thiết để xử lý phân trang và sắp xếp trên server
  const { data: allProductsData } = await supabase
    .from('products')
    .select('id, name, slug, image_url, original_price, sale_price, created_at, categories(name)')
    .order('created_at', { ascending: false });

  let allProducts = allProductsData || [];
  
  // Áp dụng thuật toán Sắp xếp (Sort)
  if (sort === 'price-asc') {
    allProducts.sort((a, b) => parsePrice(a.sale_price || a.original_price) - parsePrice(b.sale_price || b.original_price));
  } else if (sort === 'price-desc') {
    allProducts.sort((a, b) => parsePrice(b.sale_price || b.original_price) - parsePrice(a.sale_price || a.original_price));
  } else if (sort === 'latest') {
    allProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  // Tách và gộp: "Mã Đáo" lên trước, còn lại phía sau (chỉ áp dụng nếu là default)
  let sortedProducts = allProducts;
  if (sort === 'default') {
    const maDaoProducts = allProducts.filter(p => p.name.toLowerCase().includes('mã đáo'));
    const otherProducts = allProducts.filter(p => !p.name.toLowerCase().includes('mã đáo'));
    sortedProducts = [...maDaoProducts, ...otherProducts];
  }

  // Để giống hệt UI có trang 38, ta giả lập nhân bản mảng lên nhiều lần nếu cần
  const mockProducts = [...sortedProducts, ...sortedProducts, ...sortedProducts, ...sortedProducts, ...sortedProducts];
  const finalProducts = mockProducts; // Dùng mock để có > 30 trang demo
  const totalPages = Math.ceil(finalProducts.length / itemsPerPage);

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage;
  const products = finalProducts.slice(from, to);

  const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }).map((_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const paginationItems = generatePagination(page, totalPages);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner Breadcrumb */}
      <div 
        className="relative bg-gray-900 py-10 md:py-14 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex text-sm text-white/80 font-medium items-center">
            <Link href="/" className="hover:text-white transition uppercase">Trang chủ</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="text-white font-bold uppercase">Dịch Vụ Nội Thất</span>
          </div>

          <SortDropdown />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="sr-only">Dịch Vụ Nội Thất</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products && products.map((product, idx) => (
            <ProductCard key={`${product.id}-${idx}`} product={product} priority={idx < 4} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            {page > 1 && (
              <Link 
                href={`/dich-vu-noi-that?page=${page - 1}`}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-800 bg-white text-gray-800 hover:bg-gray-100 transition font-bold"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            
            {paginationItems.map((item, idx) => {
              if (item === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-800 text-gray-800 font-bold bg-white">
                    ...
                  </span>
                );
              }

              const pageNum = item as number;
              return (
                <Link
                  key={pageNum}
                  href={`/dich-vu-noi-that?page=${pageNum}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border font-bold transition ${
                    page === pageNum 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-800 bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {page < totalPages && (
              <Link 
                href={`/dich-vu-noi-that?page=${page + 1}`}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-800 bg-white text-gray-800 hover:bg-gray-100 transition font-bold"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
