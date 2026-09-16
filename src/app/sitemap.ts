import { MetadataRoute } from 'next';
import { getPublicClient } from '@/utils/supabase/public';

export const revalidate = 86400; // Cache 24h, tự động cập nhật

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getPublicClient();

  // Chạy song song cả 4 query
  const [
    { data: categories },
    { data: subCategories },
    { data: products },
    { data: news }
  ] = await Promise.all([
    supabase.from('categories').select('slug, created_at'),
    supabase.from('sub_categories').select('slug, created_at'),
    supabase.from('products').select('slug, created_at'),
    supabase.from('news').select('link, created_at')
  ]);

  const getLocalSlug = (url: string | null) => {
    if (!url) return '';
    return url.split('/').filter(Boolean).pop() || '';
  };

  // Trang tĩnh
  const staticRoutes = ['', '/ve-chung-toi', '/cam-ket', '/quy-trinh', '/tin-tuc', '/lien-he'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Trang danh mục cha
  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/danh-muc/${cat.slug}`,
    lastModified: cat.created_at ? new Date(cat.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Trang danh mục con
  const subCategoryRoutes = (subCategories || []).map((cat) => ({
    url: `${baseUrl}/danh-muc/${cat.slug}`,
    lastModified: cat.created_at ? new Date(cat.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Trang sản phẩm
  const productRoutes = (products || []).map((prod) => ({
    url: `${baseUrl}/danh-muc-san-pham/${prod.slug}`,
    lastModified: prod.created_at ? new Date(prod.created_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Trang tin tức
  const newsRoutes = (news || []).map((n) => ({
    url: `${baseUrl}/tin-tuc/${getLocalSlug(n.link)}`,
    lastModified: n.created_at ? new Date(n.created_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...subCategoryRoutes, ...productRoutes, ...newsRoutes];
}
