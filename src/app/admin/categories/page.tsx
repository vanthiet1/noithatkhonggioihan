import { createClient } from '@/utils/supabase/server';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';
import { deleteCategory, createCategory } from '@/app/actions/admin';
import { revalidatePath } from 'next/cache';
import EditCategoryButton from '@/components/EditCategoryButton';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*, sub_categories(count)')
    .order('name');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng: {categories?.length || 0} danh mục</p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm danh mục mới</h2>
        <form action={async (formData) => { 'use server'; await createCategory(formData); }} className="flex gap-3">
          <input
            type="text"
            name="name"
            required
            placeholder="Tên danh mục..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-gray-50 text-gray-900"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-sky-800 transition">
            Thêm
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tên danh mục</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Danh mục con</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary shrink-0" /> {cat.name}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm font-mono">{cat.slug}</td>
                <td className="px-6 py-4">
                  <span className="bg-sky-50 text-sky-700 text-xs font-medium px-2 py-1 rounded-lg">
                    {(cat.sub_categories as any)?.[0]?.count ?? 0} mục con
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <EditCategoryButton category={cat} />
                    <form action={async () => {
                      'use server';
                      await deleteCategory(cat.id);
                    }}>
                      <button 
                        type="submit" 
                        disabled={((cat.sub_categories as any)?.[0]?.count ?? 0) > 0}
                        title={((cat.sub_categories as any)?.[0]?.count ?? 0) > 0 ? "Không thể xóa vì đang có danh mục con" : ""}
                        className={`flex items-center text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                          ((cat.sub_categories as any)?.[0]?.count ?? 0) > 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Xóa
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!categories?.length && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Chưa có danh mục nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
