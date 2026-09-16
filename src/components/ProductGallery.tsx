'use client';

import { useState } from 'react';
import SafeImage from '@/components/SafeImage';

interface ProductGalleryProps {
  mainImage: string;
  galleryImages?: string[] | string | null;
  productName: string;
}

export default function ProductGallery({ mainImage, galleryImages, productName }: ProductGalleryProps) {
  const [activeImg, setActiveImg] = useState(mainImage || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80');

  // Parse gallery images (could be JSON string, array, or comma separated)
  let images: string[] = [];
  if (galleryImages) {
    if (Array.isArray(galleryImages)) {
      images = galleryImages;
    } else if (typeof galleryImages === 'string') {
      try {
        images = JSON.parse(galleryImages);
      } catch (e) {
        images = galleryImages.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  }

  // Hàm trích xuất tên file từ URL để so sánh (bỏ qua khác biệt về hậu tố kích thước ảnh ví dụ -600x600)
  const getFileName = (url: string) => {
    if (!url) return '';
    let name = url.split('/').pop()?.split('?')[0] || '';
    name = name.replace(/-\d+x\d+(?=\.[a-zA-Z0-9]+$)/, '');
    return name;
  };

  const uniqueImages: string[] = [];
  const seenNames = new Set<string>();

  [mainImage, ...images].filter(Boolean).forEach(img => {
    const fileName = getFileName(img);
    if (!seenNames.has(fileName)) {
      seenNames.add(fileName);
      uniqueImages.push(img);
    }
  });

  const allImages = uniqueImages;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="rounded-2xl overflow-hidden shadow-lg relative bg-gray-100 border border-gray-200 flex justify-center items-center">
        <img
          src={activeImg}
          alt={productName}
          className="w-full h-auto object-contain max-h-[70vh] rounded-2xl"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImg(img)}
              className={`relative h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all snap-start ${activeImg === img ? 'border-primary shadow-md opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
            >
              <SafeImage
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
                widthParam={160}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
