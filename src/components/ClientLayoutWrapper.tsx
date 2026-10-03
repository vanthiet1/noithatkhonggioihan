'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import CustomAIChatbot from './CustomAIChatbot';

export function ClientLayoutWrapper({
  children,
  header,
  footer,
  floating
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  floating: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Tự động bắn sự kiện page_view khi người dùng chuyển trang trong Next.js
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag && !isAdmin) {
      (window as any).gtag('event', 'page_view', {
        page_path: pathname,
      });
    }
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="flex-grow">{children}</main>
      {floating}
      {footer}
      <CustomAIChatbot />
    </>
  );
}
