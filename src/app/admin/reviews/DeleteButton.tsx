'use client';

import { deleteReview } from '@/app/actions/admin';
import { useTransition } from 'react';

export default function DeleteButton({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này không?')) {
      startTransition(async () => {
        await deleteReview(reviewId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs px-3 py-1 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
    >
      {isPending ? 'Đang xóa...' : 'Xóa'}
    </button>
  );
}
