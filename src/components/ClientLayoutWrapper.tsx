'use client';

import { usePathname } from 'next/navigation';
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
