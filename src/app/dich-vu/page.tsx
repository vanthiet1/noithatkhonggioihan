import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicClient } from '@/utils/supabase/public';
import { Maximize2 } from 'lucide-react';

export const revalidate = 3600;

export const metadata = {
  title: 'Dịch Vụ Nội Thất Đà Nẵng',
  description: 'Tổng hợp các dịch vụ nội thất được nhiều khách hàng lựa chọn tại Đà Nẵng',
};

export const dynamic = 'force-dynamic';

const categoryDisplayTitles: Record<string, string> = {
  'Cửa Lưới Chống Muỗi': 'Cửa Lưới Chống Muỗi Đà Nẵng',
  'Rèm Cửa': 'Rèm Cửa Đà Nẵng',
  'Giấy Dán Tường': 'Giấy Dán Tường Đà Nẵng',
  'Tranh Dán Tường': 'Tranh Dán Tường Đà Nẵng',
  'Tấm Ốp Tường - Trần': 'Tấm Ốp Tường Nano Đà Nẵng'
};

// Define exact desired order for subcategories
const targetSubCats = [
  "Cửa Lưới Chống Muỗi Chống Trộm",
  "Cửa Lưới Cố Định",
  "Cửa Lưới Chống Muỗi Dạng Xếp",
  "Cửa Lưới Chống Muỗi Kết Hợp Rèm",
  "Cửa Lưới Chống Muỗi Không Ray",
  "Cửa Lưới Chống Muỗi Mở Lùa",
  "Cửa Lưới Chống Muỗi Tự Cuốn",
  "Rèm Cầu Vồng",
  "Rèm Cuốn",
  "Rèm Lá Dọc",
  "Rèm Sáo",
  "Rèm Vải",
  "Giấy Dán Tường Hàn Quốc",
  "Giấy Dán Tường Nhật Bản",
  "Giấy Dán Tường 3D",
  "Giấy Dán Tường Giả Gỗ",
  "Tranh 3D Hiện Đại",
  "Tranh Anh Hùng Tương Ngộ",
  "Tranh Bản Đồ",
  "Tranh Bình Hoa",
  "Tranh Cá",
  "Tranh Café – Quán Bar – Trà Sữa",
  "Tranh Cảnh Biển",
  "Tranh Cánh Thiên Thần",
  "Tấm Ốp Tường Nhựa Hệ Lam Sóng",
  "Tấm Ốp Tường PVC Giả Gỗ",
  "Tấm Ốp Tường Giả Đá",
  "Tấm Ốp Trần Chống Nóng"
];

export default async function ServicesPage() {
  const supabase = getPublicClient();

  // Fetch all categories and their sub_categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      sub_categories (
        id,
        name,
        slug,
        image_url,
        description
      )
    `)
    .eq('status', 'published')
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`);

  if (error) {
    console.error('Error fetching categories:', error);
  }

  const targetCategories = [
    "Cửa Lưới Chống Muỗi Đà Nẵng",
    "Rèm Cửa Đà Nẵng",
    "Giấy Dán Tường Đà Nẵng",
    "Tranh Dán Tường Đà Nẵng",
    "Tấm Ốp Tường Nano Đà Nẵng"
  ];

  // Filter out categories with no sub_categories and sort them in exact requested order
  const validCategories = (categories || [])
    .filter(cat => cat.sub_categories && cat.sub_categories.length > 0)
    .sort((a, b) => {
      const nameA = categoryDisplayTitles[a.name] || a.name;
      const nameB = categoryDisplayTitles[b.name] || b.name;
      const idxA = targetCategories.indexOf(nameA);
      const idxB = targetCategories.indexOf(nameB);
      if (idxA === -1 && idxB === -1) return nameA.localeCompare(nameB);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Banner */}
      <div 
        className="relative bg-slate-900 py-12 md:py-16 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80')" }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          
          <div className="flex-1 text-white max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium mb-6">
              Dịch vụ của chúng tôi
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Dịch Vụ Nội Thất</h1>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
              Tổng hợp các dịch vụ nội thất được nhiều khách hàng lựa chọn tại Đà Nẵng, bao gồm cửa lưới chống muỗi, tấm ốp tường Nano, giấy dán tường, rèm cửa và tranh dán tường. Mỗi giải pháp đều được thiết kế để phù hợp với từng loại công trình như nhà phố, căn hộ, biệt thự, văn phòng, showroom, nhà hàng và khách sạn. Khám phá danh mục dưới đây để lựa chọn dịch vụ phù hợp, đồng thời xem chi tiết từng giải pháp, quy trình thi công và các công trình thực tế đã hoàn thiện.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-end justify-center w-full md:w-auto mt-8 md:mt-0 text-right">
             <h3 className="text-xl md:text-2xl font-medium text-white/90">Đồng hành lâu dài – Xây dựng niềm tin vững chắc</h3>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16">
        {validCategories.map((category) => {
          const displayTitle = categoryDisplayTitles[category.name] || category.name;
          
          return (
            <div key={category.id} className="mb-20 last:mb-0">
              <div className="text-center mb-12">
                <span className="inline-block bg-[#0ea5e9] text-white text-[11px] md:text-xs font-bold px-5 py-2 rounded-full mb-5 uppercase tracking-wider shadow-sm">
                  <span className="mr-1">♛</span> DỊCH VỤ NỘI THẤT KHÔNG GIỚI HẠN
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {displayTitle}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {category.sub_categories
                  .filter((sub: any) => !["Tranh Con Đường", "Tranh Mã Đáo Thành Công", "Tranh Trẻ Em"].includes(sub.name))
                  .sort((a: any, b: any) => {
                    const idxA = targetSubCats.indexOf(a.name);
                    const idxB = targetSubCats.indexOf(b.name);
                    if (idxA === -1 && idxB === -1) return a.name.localeCompare(b.name);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                  })
                  .map((sub: any) => {
                  const imageUrl = sub.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                  const description = sub.description || 'Giải pháp thay thế ưu việt, tiết kiệm không gian và chi phí với thiết kế hiện đại, chuyên nghiệp dành cho mọi công trình.';
                  
                  // Use our Next.js route for the subcategory page
                  const linkHref = `/danh-muc/${sub.slug || category.slug}`;

                  return (
                    <div key={sub.id} className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100">
                      {/* Image section */}
                      <Link href={linkHref} className="relative aspect-[2/1] w-full overflow-hidden bg-gray-100 block shrink-0">
                        <Image 
                          src={imageUrl} 
                          alt={sub.name} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          unoptimized
                        />
                      </Link>

                      {/* Content section */}
                      <div className="p-6 flex flex-col flex-1">
                        <Link href={linkHref}>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                            {sub.name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {description}
                        </p>
                        
                        <p className="text-[#0ea5e9] font-semibold text-sm mb-6 mt-auto">
                          Liên Hệ: 0766.444.789
                        </p>
                        
                        <Link 
                          href={linkHref}
                          className="flex items-center justify-center w-full py-3 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-[#0284c7] transition-colors gap-2"
                        >
                          <Maximize2 className="w-4 h-4" /> Xem Sản Phẩm
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
