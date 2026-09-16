import { createClient } from '@/utils/supabase/server';
import CreateProductForm from './CreateProductForm';
import { PackagePlus } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function CreateProductPage() {
  const supabase = await createClient();
  
  const [{ data: categories }, { data: subCategories }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('sub_categories').select('id, name, category_id').order('name')
  ]);

  return (
    <div className="w-full max-w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-primary" /> Thêm sản phẩm mới
          </h1>
          <p className="text-gray-500 text-sm mt-1">Điền đầy đủ thông tin bên dưới để tạo sản phẩm.</p>
        </div>
      </div>

      <CreateProductForm 
        categories={categories || []} 
        subCategories={subCategories || []} 
      />
    </div>
  );
}
