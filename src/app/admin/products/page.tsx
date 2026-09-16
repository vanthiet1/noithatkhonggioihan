import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Search } from 'lucide-react';
import { deleteProduct } from '@/app/actions/admin';
import EditProductButton from '@/components/EditProductButton';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const search = params.search || '';
  const itemsPerPage = 20;
  
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*, categories(name), sub_categories(name)', { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data: products, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  // Fetch categories and subcategories for the edit modal
  const [{ data: categories }, { data: subCategories }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('sub_categories').select('id, name, category_id').order('name')
  ]);

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  // Pagination logic
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pageNumbers.push(i);
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      pageNumbers.push('...');
    }
  }
  const displayPages = pageNumbers.filter((val, idx, arr) => val !== '...' || arr[idx - 1] !== '...');

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng: {count || 0} sản phẩm {search && `(kết quả cho "${search}")`}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form method="GET" action="/admin/products" className="relative flex-1 md:w-[300px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Tìm kiếm theo tên sản phẩm..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white shadow-sm text-gray-900"
            />
          </form>
          <Link 
            href="/admin/products/create"
            className="bg-primary hover:bg-sky-800 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm text-sm whitespace-nowrap"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase w-16">Ảnh</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Danh mục</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products && products.length > 0 ? products.map((product) => {
              const displayImage = product.image_url || (product.gallery_images && product.gallery_images.length > 0 ? product.gallery_images[0] : null);
              
              return (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                    {displayImage ? (
                      <Image src={displayImage} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-300 absolute inset-0 m-auto" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</p>
                  <div className="flex gap-2 mt-1">
                    {product.status === 'draft' ? (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Bản nháp</span>
                    ) : (
                      <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Công khai</span>
                    )}
                    {product.published_at && new Date(product.published_at) > new Date() && (
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">Hẹn giờ</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-lg font-medium">
                    {(product.categories as any)?.name || (product.sub_categories as any)?.name || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 max-w-[150px] truncate">{product.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a href={`/danh-muc-san-pham/${product.slug}`} target="_blank" rel="nofollow noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg font-medium bg-sky-50 text-sky-600 hover:bg-sky-100 transition">
                      Xem
                    </a>
                    <EditProductButton 
                      product={product} 
                      categories={categories || []} 
                      subCategories={subCategories || []} 
                    />
                    <DeleteButton 
                      id={product.id} 
                      onDelete={deleteProduct} 
                      confirmMessage={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`} 
                    />
                  </div>
                </td>
              </tr>
            )}) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Chưa có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-500">
              Hiển thị <span className="font-semibold">{from + 1}</span> - <span className="font-semibold">{Math.min(to + 1, count || 0)}</span> trong số <span className="font-semibold">{count}</span> sản phẩm
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/admin/products?page=${currentPage > 1 ? currentPage - 1 : 1}${search ? `&search=${search}` : ''}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 1
                    ? 'text-gray-400 bg-gray-100 pointer-events-none'
                    : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Trước
              </Link>

              {displayPages.map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`dots-${idx}`} className="px-3 py-1.5 text-sm text-gray-400">...</span>
                ) : (
                  <Link
                    key={`page-${pageNum}`}
                    href={`/admin/products?page=${pageNum}${search ? `&search=${search}` : ''}`}
                    className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-primary text-white pointer-events-none shadow-sm'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              ))}

              <Link
                href={`/admin/products?page=${currentPage < totalPages ? currentPage + 1 : totalPages}${search ? `&search=${search}` : ''}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === totalPages || totalPages === 0
                    ? 'text-gray-400 bg-gray-100 pointer-events-none'
                    : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Sau
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
