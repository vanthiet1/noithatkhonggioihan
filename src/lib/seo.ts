import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const SITE_NAME = 'Nội Thất Không Giới Hạn';

// ============================================================
// CẤU HÌNH TRANG TĨNH (Static Pages)
// ============================================================

export const SEO_HOME: Metadata = {
  title: `${SITE_NAME} - Đà Nẵng`,
  description: 'Chuyên tư vấn, cung cấp và thi công các giải pháp nội thất tại Đà Nẵng & Quảng Nam. Cửa lưới chống muỗi, rèm cửa, tranh dán tường, giấy dán tường, tấm ốp tường.',
  keywords: 'nội thất đà nẵng, cửa lưới chống muỗi đà nẵng, rèm cửa đà nẵng, giấy dán tường đà nẵng, thi công nội thất, tấm ốp tường nano đà nẵng',
  openGraph: {
    title: `${SITE_NAME} - Giải pháp nội thất toàn diện tại Đà Nẵng`,
    description: 'Chuyên thi công cửa lưới chống muỗi, rèm cửa, tranh dán tường tại Đà Nẵng và miền Trung với chất lượng cao nhất.',
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: 'vi_VN',
    type: 'website',
  },
};

export const SEO_DICH_VU: Metadata = {
  title: 'Dịch Vụ Nội Thất Đà Nẵng',
  description: 'Khám phá tất cả các sản phẩm và dịch vụ nội thất tại Nội Thất Không Giới Hạn. Cửa lưới chống muỗi, rèm cửa, giấy dán tường, tấm ốp Nano tại Đà Nẵng.',
  keywords: 'dịch vụ nội thất đà nẵng, cửa lưới chống muỗi, rèm cửa, giấy dán tường, tấm ốp nano, thi công nội thất',
  openGraph: {
    title: 'Dịch Vụ Nội Thất Đà Nẵng',
    description: 'Khám phá tất cả các sản phẩm và dịch vụ nội thất tại Nội Thất Không Giới Hạn. Cửa lưới chống muỗi, rèm cửa, giấy dán tường, tấm ốp Nano.',
    url: `${BASE_URL}/dich-vu-noi-that`,
    type: 'website',
  },
};

export const SEO_TIN_TUC: Metadata = {
  title: 'Tin Tức Nội Thất Đà Nẵng',
  description: 'Cập nhật các tin tức, kiến thức và xu hướng nội thất mới nhất từ Nội Thất Không Giới Hạn. Tư vấn giải pháp trang trí nhà đẹp tại Đà Nẵng.',
  keywords: 'tin tức nội thất, kiến thức trang trí nhà, xu hướng nội thất 2025, mẹo trang trí nhà đà nẵng',
  openGraph: {
    title: 'Tin Tức Nội Thất Đà Nẵng',
    description: 'Cập nhật các tin tức, kiến thức và xu hướng nội thất mới nhất từ Nội Thất Không Giới Hạn.',
    url: `${BASE_URL}/tin-tuc`,
    type: 'website',
  },
};

export const SEO_VE_CHUNG_TOI: Metadata = {
  title: 'Về Chúng Tôi',
  description: 'Nội Thất Không Giới Hạn là đơn vị chuyên tư vấn, cung cấp và thi công các giải pháp nội thất tại Đà Nẵng và Quảng Nam. Hơn 10+ năm kinh nghiệm, hơn 1000+ công trình thi công.',
  keywords: 'nội thất không giới hạn, về chúng tôi, công ty nội thất đà nẵng, giới thiệu công ty',
  openGraph: {
    title: 'Về Chúng Tôi',
    description: 'Nội Thất Không Giới Hạn là đơn vị chuyên tư vấn, cung cấp và thi công các giải pháp nội thất tại Đà Nẵng và Quảng Nam.',
    url: `${BASE_URL}/ve-chung-toi`,
    type: 'website',
  },
};

export const SEO_LIEN_HE: Metadata = {
  title: 'Liên Hệ',
  description: 'Liên hệ Nội Thất Không Giới Hạn để được tư vấn miễn phí về cửa lưới chống muỗi, rèm cửa, giấy dán tường tại Đà Nẵng. Hotline: 0766.444.789.',
  keywords: 'liên hệ nội thất đà nẵng, tư vấn nội thất miễn phí, hotline nội thất đà nẵng',
  openGraph: {
    title: 'Liên Hệ',
    description: 'Liên hệ để được tư vấn miễn phí về cửa lưới chống muỗi, rèm cửa, giấy dán tường tại Đà Nẵng.',
    url: `${BASE_URL}/lien-he`,
    type: 'website',
  },
};

// ============================================================
// HÀM TẠO METADATA ĐỘNG (Dynamic Pages)
// ============================================================

/** Metadata cho trang chi tiết sản phẩm */
export function buildProductMetadata(params: {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}): Metadata {
  const plainDescription = params.description
    ? params.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
    : `Mua ngay ${params.name} với giá tốt nhất tại ${SITE_NAME} Đà Nẵng. Tư vấn miễn phí, lắp đặt tận nơi.`;

  return {
    title: params.name,
    description: plainDescription,
    openGraph: {
      title: params.name,
      description: plainDescription,
      images: params.image_url
        ? [{ url: params.image_url, width: 1200, height: 630, alt: params.name }]
        : [],
      url: `${BASE_URL}/danh-muc-san-pham/${params.slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `${BASE_URL}/danh-muc-san-pham/${params.slug}`,
    },
  };
}

/** Metadata cho trang danh mục / danh mục con */
export function buildCategoryMetadata(params: {
  name?: string | null;
  slug: string;
  description?: string | null;
}): Metadata {
  const title = params.name || 'Danh Mục';
  let dynamicDesc = "";
  const s = params.slug.toLowerCase();
  if (s.includes('cua-luoi')) {
    dynamicDesc = "Giải pháp hoàn hảo bảo vệ gia đình khỏi muỗi, kiến ba khoang và côn trùng gây hại. Không gian sống luôn thông thoáng, an toàn không hóa chất.";
  } else if (s.includes('rem')) {
    dynamicDesc = "Nâng tầm không gian sống với bộ sưu tập rèm cửa sang trọng. Khả năng cản sáng 100%, cách nhiệt hiệu quả, đa dạng chất liệu và kiểu dáng.";
  } else if (s.includes('tam-op') || s.includes('nhua-op')) {
    dynamicDesc = "Khắc phục triệt để tình trạng tường ẩm mốc, bong tróc. Tấm ốp tường Nano/PVC mang lại vẻ đẹp sang trọng, thi công siêu tốc không bụi bẩn.";
  } else if (s.includes('giay-dan') || s.includes('tranh-dan')) {
    dynamicDesc = "Thay áo mới cho không gian sống chỉ trong vài giờ. Kho 10.000+ mẫu giấy dán tường, tranh 3D Hàn Quốc xu hướng mới nhất.";
  }

  const description = params.description || dynamicDesc || `Khám phá các sản phẩm ${params.name || ''} với chất lượng tốt nhất tại Đà Nẵng.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/danh-muc/${params.slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `${BASE_URL}/danh-muc/${params.slug}`,
    },
  };
}

/** Metadata cho trang chi tiết tin tức */
export function buildNewsMetadata(params: {
  title: string;
  slug: string;
  excerpt?: string | null;
  image_url?: string | null;
}): Metadata {
  const plainExcerpt = params.excerpt
    ? params.excerpt.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
    : `Đọc bài viết về ${params.title} tại ${SITE_NAME} Đà Nẵng.`;

  return {
    title: params.title,
    description: plainExcerpt,
    openGraph: {
      title: params.title,
      description: plainExcerpt,
      images: params.image_url
        ? [{ url: params.image_url, width: 1200, height: 630, alt: params.title }]
        : [],
      url: `${BASE_URL}/tin-tuc/${params.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `${BASE_URL}/tin-tuc/${params.slug}`,
    },
  };
}
