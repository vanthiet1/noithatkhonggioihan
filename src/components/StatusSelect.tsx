'use client';

import { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { toggleStatus } from '@/app/actions/admin'; 

interface StatusSelectProps {
  id: string;
  table: string;
  currentStatus: string;
}

export default function StatusSelect({ id, table, currentStatus }: StatusSelectProps) {
  const [loading, setLoading] = useState(false);
  const isPublished = currentStatus !== 'draft';

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    try {
      const result = await toggleStatus(table, id, newStatus);
      if (result?.error) {
        alert("Lỗi khi cập nhật trạng thái: " + result.error);
        e.target.value = currentStatus; // revert
      }
    } catch (error) {
      alert("Đã xảy ra lỗi!");
      e.target.value = currentStatus; // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block min-w-[105px]">
      <select
        defaultValue={currentStatus || 'published'}
        onChange={handleChange}
        disabled={loading}
        className={`w-full text-xs pl-2 pr-6 py-1.5 rounded-lg font-medium outline-none appearance-none cursor-pointer border border-gray-200 shadow-sm transition-colors bg-white ${
          currentStatus === 'draft'
            ? 'text-gray-600 focus:border-gray-300'
            : 'text-emerald-600 focus:border-emerald-300'
        } disabled:opacity-50`}
      >
        <option value="published">Công khai</option>
        <option value="draft">Bản nháp</option>
      </select>
      
      {loading ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`w-3 h-3 ${currentStatus === 'draft' ? 'text-gray-500' : 'text-emerald-500'}`} />
        </div>
      )}
    </div>
  );
}
