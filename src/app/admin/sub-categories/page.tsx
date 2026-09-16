import { createClient } from '@/utils/supabase/server';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { deleteSubCategory } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';
import CreateSubCategoryForm from '@/components/CreateSubCategoryForm';
import StatusSelect from '@/components/StatusSelect';

export default async function AdminSubCategoriesPage() {
  const supabase = await createClient();

  const [{ data: subCategories }, { data: categories }] = await Promise.all([
    supabase.from('sub_categories').select('*, categories(name), products(count)').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục con</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng: {subCategories?.length || 0} danh mục con</p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm danh mục con mới</h2>
        <CreateSubCategoryForm categories={categories || []} />
      </div>

      {/* List - grouped by category */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tên danh mục con</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Ảnh</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Danh mục cha</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subCategories?.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500 shrink-0" /> {sub.name}
                </td>
                <td className="px-6 py-4">
                  {sub.image_url ? (
                    <img src={sub.image_url} alt={sub.name} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-sky-50 text-sky-700 text-xs font-medium px-2 py-1 rounded-lg">
                    {(sub.categories as any)?.name || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm font-mono">{sub.slug}</td>
                <td className="px-6 py-4">
                  {sub.status === 'draft' ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium whitespace-nowrap">Bản nháp</span>
                  ) : sub.published_at && new Date(sub.published_at) > new Date() ? (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium flex items-center w-fit whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                      Hẹn giờ
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium whitespace-nowrap">Công khai</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <StatusSelect id={sub.id} table="sub_categories" currentStatus={sub.status || 'published'} />
                    <DeleteButton 
                      id={sub.id} 
                      onDelete={deleteSubCategory}
                      disabled={((sub.products as any)?.[0]?.count ?? 0) > 0}
                      title={((sub.products as any)?.[0]?.count ?? 0) > 0 ? "Không thể xóa vì đang chứa sản phẩm" : ""}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Xóa
                    </DeleteButton>
                  </div>
                </td>
              </tr>
            ))}
            {!subCategories?.length && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Chưa có danh mục con nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
