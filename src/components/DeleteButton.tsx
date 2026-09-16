'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<any>;
  confirmMessage?: string;
  children?: React.ReactNode;
}

export default function DeleteButton({ id, onDelete, confirmMessage = 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.', children }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Đã xảy ra lỗi khi xóa!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
      >
        {children || 'Xóa'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-500 text-sm">{confirmMessage}</p>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center shadow-md disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isDeleting ? 'Đang xóa...' : 'Đồng ý xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
