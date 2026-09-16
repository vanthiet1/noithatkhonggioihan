'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FileText, Users, LogOut, FolderOpen, Layers, Star, ImageIcon, Settings } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [unreadReviews, setUnreadReviews] = useState(0);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    const supabase = createClient();
    
    // Fetch initial count for contacts
    const fetchUnreadContacts = async () => {
      const { count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (count !== null) setUnreadContacts(count);
    };

    // Fetch initial count for reviews
    const fetchUnreadReviews = async () => {
      const { count } = await supabase
        .from('product_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);
      
      if (count !== null) setUnreadReviews(count);
    };

    fetchUnreadContacts();
    fetchUnreadReviews();

    // Subscribe to realtime changes for contacts
    const contactsChannel = supabase.channel('contacts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        () => {
          fetchUnreadContacts();
        }
      )
      .subscribe();

    // Subscribe to realtime changes for product_reviews
    const reviewsChannel = supabase.channel('reviews_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_reviews' },
        () => {
          fetchUnreadReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Danh mục', href: '/admin/categories', icon: FolderOpen },
    { name: 'Danh mục con', href: '/admin/sub-categories', icon: Layers },
    { name: 'Sản phẩm', href: '/admin/products', icon: Package },
    { name: 'Tin tức', href: '/admin/news', icon: FileText },
    { name: 'Công trình tiêu biểu', href: '/admin/featured-projects', icon: ImageIcon },
    { name: 'Đánh giá', href: '/admin/reviews', icon: Star },
    { name: 'Liên hệ', href: '/admin/contacts', icon: Users },
    { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 gap-2">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain rounded" />
          <span className="text-primary font-extrabold text-sm uppercase tracking-wider text-center">Nội Thất<br/>Không Giới Hạn</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
              >
                <Icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium text-sm flex-1">{item.name}</span>
                {item.name === 'Liên hệ' && unreadContacts > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 animate-bounce shadow-sm">
                    {unreadContacts}
                  </span>
                )}
                {item.name === 'Đánh giá' && unreadReviews > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 animate-bounce shadow-sm">
                    {unreadReviews}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <form action={logout}>
            <button type="submit" className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-medium text-sm">
              <LogOut className="w-5 h-5 mr-3" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content - tách khỏi Navbar/Footer của website */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
