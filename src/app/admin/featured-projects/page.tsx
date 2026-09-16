import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { deleteFeaturedProject } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminFeaturedProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('featured_projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Công trình tiêu biểu</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng: {projects?.length || 0} công trình</p>
        </div>
        <Link href="/admin/featured-projects/create" className="flex items-center bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-sky-800 transition shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Thêm công trình
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase w-16">Ảnh</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tên công trình</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Địa điểm</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Liên kết</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects && projects.length > 0 ? projects.map((project: any) => (
              <tr key={project.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 relative">
                    {project.image_url && (
                      <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                    )}
                    {!project.image_url && <ImageIcon className="w-6 h-6 text-gray-300 m-auto mt-4" />}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="font-semibold text-gray-800 line-clamp-2 text-sm">{project.title}</p>
                </td>
                <td className="px-6 py-3">
                  <p className="text-gray-500 text-sm">{project.location}</p>
                </td>
                <td className="px-6 py-3 text-sm">
                  {project.link ? (
                    <Link href={project.link} target="_blank" className="text-sky-600 hover:underline line-clamp-1">
                      {project.link}
                    </Link>
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/featured-projects/${project.id}/edit`} className="flex items-center text-xs px-3 py-1.5 rounded-lg font-medium bg-sky-50 text-sky-600 hover:bg-sky-100 transition">
                      <Pencil className="w-3 h-3 mr-1" /> Sửa
                    </Link>
                    <DeleteButton id={project.id} onDelete={deleteFeaturedProject} confirmMessage="Bạn có chắc chắn muốn xóa công trình này không? Hành động này không thể hoàn tác.">
                      <div className="flex items-center"><Trash2 className="w-3 h-3 mr-1" /> Xóa</div>
                    </DeleteButton>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Chưa có công trình tiêu biểu nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
