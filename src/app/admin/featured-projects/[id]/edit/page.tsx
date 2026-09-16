import EditFeaturedProjectForm from './EditFeaturedProjectForm';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditFeaturedProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: project } = await supabase
    .from('featured_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: newsList } = await supabase
    .from('news')
    .select('id, title')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/featured-projects" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Công trình tiêu biểu</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <EditFeaturedProjectForm project={project} newsList={newsList || []} />
      </div>
    </div>
  );
}
