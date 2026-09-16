import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Package, FileText, Users, Layers, FolderOpen, Clock } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: newsCount },
    { count: contactCount },
    { count: pendingCount },
    { count: categoryCount },
    { count: subCategoryCount },
    { data: recentContacts },
    { count: scheduledNewsCount },
    { count: scheduledProductCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('sub_categories').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published').gt('published_at', new Date().toISOString()),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published').gt('published_at', new Date().toISOString()),
  ]);

  const stats = [
    { title: 'Tổng sản phẩm', value: productCount ?? 0, icon: Package, color: 'text-sky-500', bg: 'bg-sky-50', href: '/admin/products' },
    { title: 'Tin tức', value: newsCount ?? 0, icon: FileText, color: 'text-sky-500', bg: 'bg-sky-50', href: '/admin/news' },
    { title: 'Bài hẹn đăng', value: scheduledNewsCount ?? 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', href: '/admin/news' },
    { title: 'Sản phẩm hẹn', value: scheduledProductCount ?? 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', href: '/admin/products' },
    { title: 'Liên hệ mới', value: pendingCount ?? 0, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', href: '/admin/contacts' },
    { title: 'Tổng liên hệ', value: contactCount ?? 0, icon: Users, color: 'text-gray-500', bg: 'bg-gray-50', href: '/admin/contacts' },
    { title: 'Danh mục', value: categoryCount ?? 0, icon: FolderOpen, color: 'text-purple-500', bg: 'bg-purple-50', href: '/admin/categories' },
    { title: 'Danh mục con', value: subCategoryCount ?? 0, icon: Layers, color: 'text-pink-500', bg: 'bg-pink-50', href: '/admin/sub-categories' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
        <p className="text-gray-500 text-sm mt-1">Chào mừng bạn trở lại trang quản trị Nội Thất Không Giới Hạn.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} href={stat.href} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center hover:shadow-md transition group">
              <div className={`w-14 h-14 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent pending contacts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Liên hệ chờ xử lý</h2>
          <Link href="/admin/contacts" className="text-sm text-primary font-medium hover:underline">Xem tất cả →</Link>
        </div>
        {recentContacts && recentContacts.length > 0 ? (
          <table className="w-full">
            <tbody className="divide-y divide-gray-50">
              {recentContacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 font-medium text-gray-800 text-sm">{c.name}</td>
                  <td className="px-6 py-3">
                    <a href={`tel:${c.phone}`} className="text-primary text-sm font-medium">{c.phone}</a>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-sm truncate max-w-[200px]">{c.message || '—'}</td>
                  <td className="px-6 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">Không có liên hệ nào đang chờ xử lý.</div>
        )}
      </div>
    </div>
  );
}
