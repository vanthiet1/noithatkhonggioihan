"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'default';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    // Reset back to page 1 when sorting changes
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select 
        value={currentSort}
        onChange={handleChange}
        className="bg-white/20 text-white text-sm py-2.5 pl-4 pr-10 rounded-full border border-white/20 focus:outline-none focus:border-white/50 appearance-none cursor-pointer hover:bg-white/30 transition shadow-sm backdrop-blur-sm"
      >
        <option value="default" className="text-gray-800">Sắp xếp mặc định</option>
        <option value="latest" className="text-gray-800">Mới nhất</option>
        <option value="price-asc" className="text-gray-800">Thứ tự theo giá: thấp đến cao</option>
        <option value="price-desc" className="text-gray-800">Thứ tự theo giá: cao xuống thấp</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}
