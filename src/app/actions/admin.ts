'use server'
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

// =================== CATEGORIES ===================
export async function createCategory(formData: FormData) {
  const supabase = createAdminClient();
  const name = (formData.get('name') as string)?.trim();
  const slug = name.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const status = formData.get('status') as string || 'published';
  const published_at = formData.get('published_at') as string || new Date().toISOString();
  const { error } = await supabase.from('categories').insert({ name, slug, status, published_at });
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/dich-vu');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const name = (formData.get('name') as string)?.trim();
  const slug = name.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const status = formData.get('status') as string || 'published';
  const published_at = formData.get('published_at') as string || new Date().toISOString();

  if (status === 'draft') {
    const { count } = await supabase.from('sub_categories').select('*', { count: 'exact', head: true }).eq('category_id', id);
    if (count && count > 0) return { error: 'Không thể ẩn danh mục này vì đang chứa danh mục con.' };
  }

  const { error } = await supabase.from('categories').update({ name, slug, status, published_at }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/dich-vu');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/dich-vu');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

// =================== SUB-CATEGORIES ===================
export async function createSubCategory(formData: FormData) {
  const supabase = createAdminClient();
  const name = (formData.get('name') as string)?.trim();
  const category_id = formData.get('category_id') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File | null;
  const slug = name.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  
  let image_url = null;
  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `subcat-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `sub-categories/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image);
      
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      image_url = data.publicUrl;
    }
  }

  const status = formData.get('status') as string || 'published';
  const published_at = formData.get('published_at') as string || new Date().toISOString();

  const { error } = await supabase.from('sub_categories').insert({ name, slug, category_id, description, image_url, status, published_at });
  if (error) return { error: error.message };
  revalidatePath('/admin/sub-categories');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/dich-vu');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function deleteSubCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('sub_categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/sub-categories');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/dich-vu');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

// =================== CONTACTS ===================
export async function updateContactStatus(id: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/contacts');
  return { success: true };
}

export async function deleteContact(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/contacts');
  return { success: true };
}

// =================== NEWS ===================
export async function createNews(formData: FormData) {
  const supabase = createAdminClient();
  const title = (formData.get('title') as string)?.trim();
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as File | null;
  
  const link = `/tin-tuc/${title.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`;

  let image_url = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `news-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `news/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image);
      
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      image_url = data.publicUrl;
    }
  }

  const { error } = await supabase.from('news').insert({
    title,
    link,
    excerpt,
    content,
    image_url,
    seo_title: formData.get('seo_title') as string,
    seo_description: formData.get('seo_description') as string,
    seo_keyword: formData.get('seo_keyword') as string,
    status: formData.get('status') as string || 'published',
    published_at: formData.get('published_at') as string || new Date().toISOString()
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/news');
  revalidatePath('/');
  revalidatePath('/tin-tuc');
  revalidatePath('/tin-tuc/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const title = (formData.get('title') as string)?.trim();
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as File | null;
  const link = `/tin-tuc/${title.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`;

  const updateData: any = { 
    title, 
    link, 
    excerpt, 
    content,
    seo_title: formData.get('seo_title') as string,
    seo_description: formData.get('seo_description') as string,
    seo_keyword: formData.get('seo_keyword') as string,
    status: formData.get('status') as string || 'published',
    published_at: formData.get('published_at') as string || new Date().toISOString()
  };

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `news-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `news/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, image);
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      updateData.image_url = data.publicUrl;
    }
  }

  const { error } = await supabase.from('news').update(updateData).eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/news');
  revalidatePath('/');
  revalidatePath('/tin-tuc');
  revalidatePath('/tin-tuc/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/news');
  revalidatePath('/');
  revalidatePath('/tin-tuc');
  revalidatePath('/tin-tuc/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

// =================== PRODUCTS ===================
export async function createProduct(formData: FormData) {
  const supabase = createAdminClient();
  const name = (formData.get('name') as string)?.trim();
  const sub_category_id = formData.get('sub_category_id') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File | null;
  
  const original_price = formData.get('original_price') as string;
  const sale_price = formData.get('sale_price') as string;
  
  const slug = name.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  
  // Get category_id from sub_category
  const { data: subCat } = await supabase.from('sub_categories').select('category_id').eq('id', sub_category_id).single();
  const category_id = subCat?.category_id;

  let image_url = null;
  let gallery_images: string[] = [];

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image);
      
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      image_url = data.publicUrl;
      gallery_images = [data.publicUrl];
    }
  }

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    description,
    category_id,
    sub_category_id,
    image_url,
    gallery_images,
    original_price,
    sale_price,
    seo_title: formData.get('seo_title') as string,
    seo_description: formData.get('seo_description') as string,
    seo_keyword: formData.get('seo_keyword') as string,
    status: formData.get('status') as string || 'published',
    published_at: formData.get('published_at') as string || new Date().toISOString()
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/danh-muc-san-pham/[slug]', 'page');
  revalidatePath('/dich-vu-noi-that');
  revalidatePath('/sitemap.xml');
  return { success: true };
}
export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/danh-muc-san-pham/[slug]', 'page');
  revalidatePath('/dich-vu-noi-that');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const name = (formData.get('name') as string)?.trim();
  const sub_category_id = formData.get('sub_category_id') as string;
  const description = formData.get('description') as string;
  const original_price = formData.get('original_price') as string;
  const sale_price = formData.get('sale_price') as string;
  const image = formData.get('image') as File | null;
  
  const slug = name.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  
  // Get category_id from sub_category
  const { data: subCat } = await supabase.from('sub_categories').select('category_id').eq('id', sub_category_id).single();
  const category_id = subCat?.category_id;

  const updateData: any = {
    name,
    slug,
    description,
    category_id,
    sub_category_id,
    original_price,
    sale_price,
    seo_title: formData.get('seo_title') as string,
    seo_description: formData.get('seo_description') as string,
    seo_keyword: formData.get('seo_keyword') as string,
    status: formData.get('status') as string || 'published',
    published_at: formData.get('published_at') as string || new Date().toISOString()
  };

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image);
      
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      updateData.image_url = data.publicUrl;
      // Ideally we should append to gallery_images, but for simple update we just update the main image
    }
  }

  const { error } = await supabase.from('products').update(updateData).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/danh-muc-san-pham/[slug]', 'page');
  revalidatePath('/dich-vu-noi-that');
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function uploadEditorImage(formData: FormData) {
  const supabase = createAdminClient();
  const image = formData.get('image') as File | null;
  
  if (!image || image.size === 0) {
    return { error: 'No image provided' };
  }
  
  const fileExt = image.name.split('.').pop();
  const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `editor/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, image);
    
  if (uploadError) {
    return { error: uploadError.message };
  }
  
  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return { url: data.publicUrl };
}

// =================== REVIEWS ===================
export async function updateReviewStatus(id: string, is_approved: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('product_reviews').update({ is_approved }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/reviews');
  revalidatePath('/danh-muc-san-pham/[slug]', 'page');
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('product_reviews').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/reviews');
  revalidatePath('/danh-muc-san-pham/[slug]', 'page');
  return { success: true };
}

// =================== FEATURED PROJECTS ===================
export async function createFeaturedProject(formData: FormData) {
  const supabase = createAdminClient();
  const title = (formData.get('title') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const link = formData.get('link') as string || null;
  const image = formData.get('image') as File | null;
  
  let image_url = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `project-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `projects/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image);
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: 'Lỗi tải ảnh: ' + uploadError.message };
    }
    
    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    image_url = data.publicUrl;
  }

  const { error } = await supabase.from('featured_projects').insert({
    title,
    location,
    link,
    image_url,
    status: formData.get('status') as string || 'published',
    published_at: formData.get('published_at') as string || new Date().toISOString()
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/featured-projects');
  revalidatePath('/');
  return { success: true };
}

export async function updateFeaturedProject(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const title = (formData.get('title') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const link = formData.get('link') as string || null;
  const image = formData.get('image') as File | null;
  
  const updateData: any = { 
    title, 
    location, 
    link,
    status: formData.get('status') as string || 'published',
    published_at: formData.get('published_at') as string || new Date().toISOString()
  };

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `project-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `projects/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, image);
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: 'Lỗi tải ảnh: ' + uploadError.message };
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    updateData.image_url = data.publicUrl;
  }

  const { error } = await supabase.from('featured_projects').update(updateData).eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/featured-projects');
  revalidatePath('/');
  return { success: true };
}

export async function deleteFeaturedProject(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('featured_projects').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/featured-projects');
  revalidatePath('/');
  return { success: true };
}

export async function toggleStatus(table: string, id: string, newStatus: string) {
  const supabase = createAdminClient();

  if (newStatus === 'draft') {
    if (table === 'categories') {
      const { count } = await supabase.from('sub_categories').select('*', { count: 'exact', head: true }).eq('category_id', id);
      if (count && count > 0) return { error: 'Không thể ẩn danh mục này vì đang chứa danh mục con.' };
    } else if (table === 'sub_categories') {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('sub_category_id', id);
      if (count && count > 0) return { error: 'Không thể ẩn danh mục này vì đang chứa sản phẩm.' };
    }
  }

  const updateData: any = { status: newStatus };
  
  // If toggling to published via quick action, ensure it publishes immediately by resetting future dates
  if (newStatus === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from(table).update(updateData).eq('id', id);
  if (error) return { error: error.message };
  
  if (table === 'categories') {
    revalidatePath('/admin/categories');
    revalidatePath('/danh-muc/[slug]', 'page');
  } else if (table === 'sub_categories') {
    revalidatePath('/admin/sub-categories');
    revalidatePath('/danh-muc/[slug]', 'page');
  } else if (table === 'news') {
    revalidatePath('/admin/news');
    revalidatePath('/tin-tuc');
  } else if (table === 'featured_projects') {
    revalidatePath('/admin/featured-projects');
  } else if (table === 'products') {
    revalidatePath('/admin/products');
    revalidatePath('/danh-muc-san-pham/[slug]', 'page');
  }
  revalidatePath('/');
  return { success: true };
}
