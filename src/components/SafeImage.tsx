'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getOptimizedImageUrl, getOriginalImageUrl } from '@/lib/image-utils';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
  widthParam?: number;
  qualityParam?: number;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80';

export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  widthParam = 500,
  qualityParam = 75,
  alt,
  className = '',
  ...props
}: SafeImageProps) {
  const initialUrl = getOptimizedImageUrl(src, { width: widthParam, quality: qualityParam }) || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);

  // Khi prop src thay đổi, reset lại trạng thái
  useEffect(() => {
    const nextUrl = getOptimizedImageUrl(src, { width: widthParam, quality: qualityParam }) || fallbackSrc;
    setCurrentSrc(nextUrl);
    setIsLoading(true);
    setFallbackAttempt(0);
  }, [src, widthParam, qualityParam, fallbackSrc]);

  const handleError = () => {
    if (fallbackAttempt === 0 && src) {
      // Lần lỗi 1: Thử lại với URL file gốc từ Supabase (bỏ qua render endpoint)
      const rawOriginal = getOriginalImageUrl(src);
      if (rawOriginal && rawOriginal !== currentSrc) {
        setFallbackAttempt(1);
        setCurrentSrc(rawOriginal);
        return;
      }
    }

    // Lần lỗi 2: Chuyển sang ảnh fallback dự phòng
    setFallbackAttempt(2);
    setCurrentSrc(fallbackSrc);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Khung chờ Skeleton Shimmer khi đang tải */}
      {isLoading && (
        <div 
          className="absolute inset-0 z-0 bg-slate-200 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Ảnh chính với hiệu ứng Fade-in mượt mà khi hoàn thành */}
      <Image
        {...props}
        src={currentSrc}
        alt={alt || 'Hình ảnh'}
        className={`transition-opacity duration-300 ease-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
}
