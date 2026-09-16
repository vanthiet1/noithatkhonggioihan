/**
 * Utility hỗ trợ tối ưu hóa và làm mượt ảnh Supabase Storage
 */

export interface OptimizeImageOptions {
  width?: number;
  quality?: number;
}

/**
 * Tối ưu hóa URL ảnh từ Supabase Storage:
 * Chuyển đổi từ file gốc (/storage/v1/object/public/) sang endpoint WebP CDN (/storage/v1/render/image/public/)
 * Giúp giảm ~90% dung lượng (ví dụ 258KB -> 18KB) và tải tức thì từ CDN Cloudflare.
 * Nếu không phải ảnh Supabase Storage, giữ nguyên URL gốc.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: OptimizeImageOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';
  
  // Bỏ qua nếu là placeholder hoặc ảnh svg/data url
  if (url.startsWith('data:') || url.endsWith('.svg') || url.includes('placeholder')) {
    return url;
  }

  const { width = 500, quality = 75 } = options;

  // Supabase Storage URL format:
  // https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/<bucket>/<path>
  const supabasePattern = /\/storage\/v1\/object\/public\//;
  if (supabasePattern.test(url)) {
    const cleanUrl = url.split('?')[0];
    return cleanUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') +
      `?width=${width}&quality=${quality}`;
  }

  return url;
}

/**
 * Lấy URL gốc (loại bỏ tham số render) phòng trường hợp cần fallback
 */
export function getOriginalImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const supabaseRenderPattern = /\/storage\/v1\/render\/image\/public\//;
  if (supabaseRenderPattern.test(url)) {
    const cleanUrl = url.split('?')[0];
    return cleanUrl.replace('/storage/v1/render/image/public/', '/storage/v1/object/public/');
  }
  return url.split('?')[0];
}
