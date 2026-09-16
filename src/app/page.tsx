import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Gem, Wrench, ThumbsUp, HeartHandshake, Phone, ArrowUpRight, Star, Shield, BadgeDollarSign, PenTool } from 'lucide-react';
import { SEO_HOME } from '@/lib/seo';
import { getPublicClient } from '@/utils/supabase/public';
import FeaturedProjectsClient from '@/components/FeaturedProjectsClient';
import SafeImage from '@/components/SafeImage';

export const metadata: Metadata = SEO_HOME;
export const revalidate = 3600;

export default async function Home() {
  const supabase = getPublicClient();
  const [
    { data: featuredProjects },
    { data: siteSettings },
    { data: latestNews }
  ] = await Promise.all([
    supabase
      .from('featured_projects')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase
      .from('site_settings')
      .select('key, value'),
    supabase
      .from('news')
      .select('id, title, link, excerpt, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
  ]);

  const getSetting = (key: string, defaultValue: string) => {
    const setting = siteSettings?.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  const aboutImage = getSetting('homepage_about_image', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000');

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[750px] lg:min-h-[650px] py-24 lg:py-0 bg-slate-50 flex items-center overflow-hidden">
        {/* Background Image (Mock) */}
        <div className="absolute inset-0 z-0 flex justify-end">
           <div className="w-[60%] h-full relative">
             <Image 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000"
                alt="Nội Thất Không Giới Hạn - Thi công nội thất tại Đà Nẵng" 
                fill
                sizes="60vw"
                className="object-cover"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
           </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex h-full items-center">
          <div className="w-full lg:w-1/2 animate-fade-in-up">
            <h2 className="text-primary font-bold text-xl md:text-2xl mb-2 tracking-wide uppercase">
              Giải Pháp Nội Thất
            </h2>
            <h2 className="text-5xl md:text-7xl font-extrabold text-primary mb-4 leading-tight">
              TOÀN DIỆN TẠI ĐÀ NẴNG
            </h2>
            <p className="text-secondary text-2xl md:text-3xl italic mb-6">
              Không gian đẹp - Cuộc sống tốt hơn
            </p>
            <p className="text-gray-700 text-lg mb-8 max-w-lg leading-relaxed">
              Chuyên tư vấn, cung cấp và thi công các giải pháp nội thất tại Đà Nẵng & Quảng Nam
            </p>

            {/* Features Grid */}
            <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 mb-10 w-full max-w-2xl">
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-2">
                   <Phone size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-800">Tư vấn<br/>miễn phí</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-2">
                   <Gem size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-800">Vật liệu<br/>chất lượng</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-2">
                   <Wrench size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-800">Thi công<br/>chuyên nghiệp</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-2">
                   <Shield size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-800">Bảo hành<br/>uy tín</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-2">
                   <BadgeDollarSign size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-800">Giá cả<br/>hợp lý</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <a href="tel:+84766444789" className="px-5 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-base bg-primary text-white rounded-full font-bold hover:bg-sky-800 transition flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1" rel="nofollow">
                NHẬN TƯ VẤN MIỄN PHÍ <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <Link href="/dich-vu" className="px-5 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-base bg-white text-primary border-2 border-primary rounded-full font-bold hover:bg-gray-50 transition flex items-center justify-center">
                Xem dịch vụ <ArrowUpRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Right Floating features */}
          <div className="hidden lg:flex flex-col absolute right-10 top-1/2 -translate-y-1/2 gap-6">
             <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex flex-col items-center text-center w-32 border-b-4 border-secondary animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <CheckCircle2 className="text-primary mb-2 w-8 h-8" />
                <span className="text-xs font-bold text-gray-800">Thi công<br/>đúng tiến độ</span>
             </div>
             <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex flex-col items-center text-center w-32 border-b-4 border-secondary animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <ShieldCheck className="text-primary mb-2 w-8 h-8" />
                <span className="text-xs font-bold text-gray-800">Báo giá<br/>minh bạch</span>
             </div>
             <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex flex-col items-center text-center w-32 border-b-4 border-secondary animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <ThumbsUp className="text-primary mb-2 w-8 h-8" />
                <span className="text-xs font-bold text-gray-800">Bảo hành<br/>chu đáo</span>
             </div>
          </div>
        </div>
      </section>

      {/* 1.5. ABOUT / INTRODUCTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 animate-fade-in-up">
               <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
                 <PenTool className="w-4 h-4" /> 
                 THI CÔNG NỘI THẤT ĐÀ NẴNG
               </div>
               
               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                 Thi Công Nội Thất Đà Nẵng Chuyên Nghiệp – Giải Pháp Trọn Gói Cho Mọi Không Gian
               </h1>
               
               <h3 className="text-xl font-bold text-primary mb-6">
                 Chuyên thi công cửa lưới chống muỗi • Tấm ốp tường Nano • Giấy dán tường • Rèm cửa • Tranh dán tường tại Đà Nẵng
               </h3>
               
               <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                 <strong className="text-gray-900">Nội Thất Không Giới Hạn</strong> chuyên tư vấn và thi công nội thất tại Đà Nẵng mang đến các giải pháp cửa lưới chống muỗi, tấm ốp tường Nano, giấy dán tường, rèm cửa và tranh dán tường. Chúng tôi cam kết khảo sát miễn phí, báo giá minh bạch, vật liệu chính hãng, thi công đúng tiến độ và bảo hành chu đáo.
               </p>
               
               <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
                 {[
                   'Cửa Lưới Chống muỗi', 'Tấm Ốp Tường Nano', 'Giấy Dán Tường', 'Rèm Cửa Cao Cấp', 'Tranh Dán Tường 3D'
                 ].map((item, i) => (
                   <span key={i} className="flex items-center text-sm font-bold text-primary">
                     <CheckCircle2 className="w-4 h-4 mr-1.5 text-primary" /> {item}
                   </span>
                 ))}
               </div>

               <div className="flex flex-wrap gap-4">
                 <a href="tel:+84766444789" className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center hover:bg-sky-800 transition shadow-md">
                   <Phone className="w-4 h-4 mr-2" />
                   Nhận Báo Giá Miễn Phí
                 </a>
                 <Link href="/dich-vu" className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-bold flex items-center hover:bg-sky-50 transition bg-white">
                   Xem Dịch Vụ <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
               </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-2 bg-white">
                <Image 
                  src={aboutImage}
                  alt="Thi Công Nội Thất Đà Nẵng Chuyên Nghiệp"
                  width={800}
                  height={800}
                  className="w-full h-auto rounded-xl object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS & FEATURES */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-0 lg:divide-x lg:divide-gray-100">
             {[
               { title: "500+ Công Trình", sub: "Hoàn Thành, hoàn thiện", desc: "Cửa lưới chống muỗi, tấm ốp tường Nano, tranh dán tường, giấy dán tường và rèm cửa tại Đà Nẵng." },
               { title: "Khảo Sát Miễn Phí", sub: "Khảo sát tận nơi", desc: "Tư vấn giải pháp tối ưu cho từng không gian sống và làm việc." },
               { title: "Báo Giá Minh Bạch", sub: "Báo giá rõ ràng", desc: "Chi tiết từng hạng mục, không phát sinh chi phí ngoài hợp đồng." },
               { title: "Vật Liệu Chính Hãng", sub: "Vật liệu chất lượng cao", desc: "Nguồn gốc rõ ràng, đảm bảo bền đẹp theo thời gian." },
               { title: "Thi Công", sub: "Thi công chuyên nghiệp", desc: "Đúng tiến độ, đúng kỹ thuật mang lại chất lượng hoàn thiện cao." },
               { title: "Bảo Hành Chu Đáo", sub: "Bảo hành dài hạn", desc: "Hỗ trợ bảo trì nhanh chóng, giúp khách hàng an tâm sử dụng." },
             ].map((item, idx) => (
               <div key={idx} className="px-2 lg:px-4 xl:px-6 flex flex-col items-center text-center">
                  <h3 className="text-sky-500 font-bold text-lg xl:text-xl mb-1.5">{item.title}</h3>
                  <h4 className="text-gray-900 font-bold text-[13px] xl:text-sm mb-3">{item.sub}</h4>
                  <p className="text-gray-500 text-[12px] mb-5 leading-relaxed flex-grow">{item.desc}</p>
                  <div className="w-8 h-[3px] bg-sky-400 mt-auto rounded-full"></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 2. SẢN PHẨM - DỊCH VỤ NỔI BẬT */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 uppercase flex items-center justify-center gap-4">
            <span className="w-12 h-1 bg-secondary hidden md:block"></span>
            Dịch Vụ Nội Thất Đà Nẵng
            <span className="w-12 h-1 bg-secondary hidden md:block"></span>
          </h2>
          <p className="text-gray-600 mb-12">Được Khách Hàng Tin Chọn</p>
          
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { title: "Cửa Lưới Chống Muỗi Đà Nẵng", desc: "Lắp đặt cửa lưới chống muỗi bền đẹp, thông thoáng, bảo vệ không gian sống khỏi côn trùng.", img: "https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/product-images/categories/hinh-anh_2026-08-01_205146571.jpg", link: "/danh-muc/cua-luoi-chong-muoi-da-nang" },
              { title: "Tấm ốp tường Nano Đà Nẵng", desc: "Tấm ốp Nano chống ẩm, chống mốc, cách nhiệt, tăng tính thẩm mỹ cho mọi không gian.", img: "https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/product-images/categories/hinh-anh_2026-08-01_204841959.jpg", link: "/danh-muc/tam-op-tuong-nano-da-nang" },
              { title: "Giấy Dán Tường Đà Nẵng", desc: "Thi công giấy dán tường đẹp, đa dạng mẫu mã, bền theo thời gian.", img: "https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/product-images/categories/hinh-anh_2026-08-01_204309418.jpg", link: "/danh-muc/giay-dan-tuong-da-nang" },
              { title: "Tranh Dán Tường Đà Nẵng", desc: "Tranh dán tường 3D đa dạng mẫu mã, tạo điểm nhấn sang trọng cho phòng khách, phòng ngủ.", img: "https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/product-images/categories/hinh-anh_2026-08-01_204548901.jpg", link: "/danh-muc/tranh-dan-tuong-3d-da-nang" },
              { title: "Rèm Cửa Đà Nẵng", desc: "Rèm cửa cao cấp chống nắng, cản sáng hiệu quả, nhiều mẫu đẹp phù hợp mọi không gian.", img: "https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/product-images/categories/hinh-anh_2026-08-01_204908801.jpg", link: "/danh-muc/rem-cua-da-nang" },

            ].map((item, idx) => (
               <div key={idx} className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
                 <Link href={item.link} className="block aspect-[21/9] sm:h-56 w-full relative overflow-hidden">
                    <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                 </Link>
                 <div className="p-6 flex-grow flex flex-col text-left">
                    <Link href={item.link}>
                      <h3 className="font-bold text-lg text-gray-900 hover:text-primary transition mb-3">{item.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{item.desc}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-4 border-t border-gray-50 gap-3">
                      <a href="tel:0766444789" className="text-sm font-semibold text-primary hover:text-sky-800 transition text-center w-full sm:w-auto sm:text-left border border-primary sm:border-0 rounded-lg py-2 sm:py-0">
                        Liên Hệ: 0766.444.789
                      </a>
                      <a href="tel:0766444789" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-sky-800 transition shadow-sm w-full sm:w-auto">
                        <Phone className="w-4 h-4" />
                        Nhận Báo Giá
                      </a>
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>




      {/* 5. QUY TRÌNH LÀM VIỆC */}
      <section className="py-10 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 uppercase flex items-center justify-center gap-4">
             <span className="w-12 h-1 bg-secondary hidden md:block"></span>
             Quy Trình Thi Công
             <span className="w-12 h-1 bg-secondary hidden md:block"></span>
          </h3>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">Quy trình thi công chuyên nghiệp, báo giá minh bạch và đảm bảo chất lượng cho mọi công trình tại Đà Nẵng.</p>

          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6">
               {[
                 { icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Khảo Sát Miễn Phí", desc: "Khảo sát thực tế và tư vấn tận nơi." },
                 { icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Tư Vấn & Báo Giá", desc: "Đề xuất giải pháp và báo giá minh bạch." },
                 { icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Xác Nhận Phương Án", desc: "Thống nhất mẫu mã, vật liệu và thời gian thi công." },
                 { icon: <PenTool className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Thi Công & Lắp Đặt", desc: "Thi công đúng kỹ thuật, đúng tiến độ." },
                 { icon: <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Bàn Giao & Bảo Hành", desc: "Kiểm tra, bàn giao và bảo hành theo cam kết." },
               ].map((step, idx) => (
                 <div key={idx} className="flex flex-col items-center bg-white p-3 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-3 sm:mb-6">
                      {step.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-[13px] sm:text-base md:text-lg mb-2 sm:mb-3 h-auto md:h-12 flex items-center justify-center text-center">{step.title}</h3>
                    <p className="text-[11px] sm:text-sm text-gray-500">{step.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. DỰ ÁN TIÊU BIỂU */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 uppercase flex items-center justify-center gap-4">
              <span className="w-16 h-[2px] bg-secondary hidden md:block"></span>
              CÔNG TRÌNH TIÊU BIỂU CỦA NỘI THẤT KHÔNG GIỚI HẠN
              <span className="w-16 h-[2px] bg-secondary hidden md:block"></span>
            </h2>
            <p className="text-gray-700 font-medium">Những công trình đã tạo nên không gian sống của bạn</p>
          </div>

          <FeaturedProjectsClient projects={featuredProjects || []} />
        </div>
      </section>

      {/* 7. KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI */}
      <section className="py-5 bg-slate-50">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
               Khách Hàng Nói Gì Về Nội Thất Không Giới Hạn?
             </h2>
             <div className="flex items-center justify-center gap-2">
               <div className="flex text-[#f59e0b]">
                 <Star className="w-5 h-5 fill-current" />
                 <Star className="w-5 h-5 fill-current" />
                 <Star className="w-5 h-5 fill-current" />
                 <Star className="w-5 h-5 fill-current" />
                 <Star className="w-5 h-5 fill-current" />
               </div>
               <span className="text-[#d97706] font-medium text-sm md:text-base">
                 4.9/5 từ hơn 150+ đánh giá khách hàng
               </span>
             </div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { 
                 service: "Cửa lưới chống muỗi:",
                 text: "Nhà mình lắp cửa lưới chống muỗi cho toàn bộ cửa sổ và cửa ra vào. Thợ làm cẩn thận, sạch sẽ, hướng dẫn sử dụng rất chi tiết. Từ ngày lắp xong, nhà thông thoáng mà không còn lo muỗi vào buổi tối.", 
                 name: "Anh Tuấn Anh", 
                 loc: "Chủ nhà phố • Hòa Xuân, Cẩm Lệ",
                 avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
               },
               { 
                 service: "Tấm ốp tường Nano:",
                 text: "Mình chọn tấm ốp tường Nano để làm mới phòng khách. Thi công nhanh, bề mặt đẹp, dễ vệ sinh và nhìn hiện đại hơn rất nhiều. Báo giá rõ ràng, đúng như đã tư vấn.", 
                 name: "Chị Bảo Ngọc", 
                 loc: "Căn hộ FPT Plaza • Ngũ Hành Sơn",
                 avatar: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80"
               },
               { 
                 service: "Rèm cửa:",
                 text: "Được tư vấn màu sắc và chất liệu rèm rất phù hợp với không gian. Thi công đúng hẹn, hoàn thiện đẹp và gọn gàng. Cả gia đình đều rất hài lòng với chất lượng sản phẩm.", 
                 name: "Anh Hoàng Phúc", 
                 loc: "Biệt thự Hòa Xuân • Cẩm Lệ",
                 avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
               },
               { 
                 service: "Giấy dán tường:",
                 text: "Văn phòng công ty sử dụng giấy dán tường kết hợp rèm cửa. Đội ngũ làm việc chuyên nghiệp, thi công đúng tiến độ nên không ảnh hưởng đến hoạt động của doanh nghiệp.", 
                 name: "Công ty An Phát", 
                 loc: "Văn phòng • Thanh Khê, Đà Nẵng",
                 avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=150&q=80"
               },
               { 
                 service: "Tranh dán tường:",
                 text: "Quán được tư vấn mẫu tranh rất phù hợp với phong cách thiết kế. Thi công nhanh, hình ảnh sắc nét, tạo điểm nhấn đẹp và được khách đến quán khen rất nhiều.", 
                 name: "Quán Cà Phê Mộc", 
                 loc: "Mỹ An • Ngũ Hành Sơn",
                 avatar: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80"
               },
               { 
                 service: "Tấm ốp tường Nano & Lam sóng PVC:",
                 text: "Khách sạn cần cải tạo khu vực sảnh và hành lang trong thời gian ngắn. Đội thi công làm đúng tiến độ, hoàn thiện đẹp, sạch sẽ và không ảnh hưởng đến việc đón khách.", 
                 name: "Khách sạn Blue Sea", 
                 loc: "Đường Võ Nguyên Giáp • Sơn Trà, Đà Nẵng",
                 avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80"
               },
             ].map((review, idx) => (
               <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-row gap-4 items-start">
                  <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden shrink-0 relative border border-gray-200">
                     <Image src={review.avatar} alt={review.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex gap-1 text-sky-500 mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="text-gray-800 text-sm mb-1 italic font-medium">{review.service}</p>
                    <p className="text-gray-600 text-sm italic mb-4 leading-relaxed line-clamp-4">"{review.text}"</p>
                    <div className="mt-auto text-xs text-gray-500">
                      <span className="font-bold text-gray-900">{review.name}</span> / {review.loc}
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 8. KIẾN THỨC HỮU ÍCH / BÀI VIẾT MỚI NHẤT */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4">
           <div className="flex flex-col mb-12">
             <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm w-max">
                <PenTool className="w-4 h-4" /> 
                KIẾN THỨC HỮU ÍCH
             </div>
             
             <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Bài viết mới nhất
             </h3>
           </div>

           {/* Thêm flex overflow-x-auto cho mobile để có thể vuốt ngang, trên desktop giữ nguyên grid */}
            <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               {latestNews && latestNews.length > 0 ? latestNews.map((article) => {
                 const localSlug = article.link ? article.link.split('/').filter(Boolean).pop() : '';
                 const href = localSlug ? `/tin-tuc/${localSlug}` : '/tin-tuc';
                 
                 // Fallback image based on keywords in title
                 const getFallbackImage = (title: string) => {
                   const t = title.toLowerCase();
                   if (t.includes('giấy dán tường')) return 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=600';
                   if (t.includes('tranh dán tường') && t.includes('bếp')) return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600';
                   if (t.includes('tranh dán tường')) return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600';
                   if (t.includes('bếp')) return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600';
                   if (t.includes('cửa lưới') || t.includes('muỗi')) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                   return 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600';
                 };
                 
                 const imageUrl = article.image_url || getFallbackImage(article.title);

                 return (
                   <div key={article.id} className="min-w-[85%] md:min-w-0 shrink-0 snap-center bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                      <Link href={href} className="relative h-48 w-full block overflow-hidden bg-gray-100">
                         <SafeImage src={imageUrl} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" widthParam={600} />
                      </Link>
                      <div className="p-6 flex flex-col flex-grow">
                        <Link href={href}>
                          <h3 className="font-bold text-gray-900 text-lg mb-2 hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">{article.title}</h3>
                        </Link>
                        <p className="text-xs text-gray-400 font-medium mb-4">{new Date(article.created_at).toLocaleDateString('vi-VN')}</p>
                        <div className="w-8 h-0.5 bg-sky-300 mb-4"></div>
                        <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                      </div>
                   </div>
                 );
               }) : (
                 <p className="col-span-full text-center text-gray-500">Chưa có bài viết nào.</p>
               )}
            </div>
           
           <Link href="/tin-tuc" className="flex justify-center mt-10 gap-2 cursor-pointer group">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-800 group-hover:bg-primary transition-colors"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-primary/60 transition-colors"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-primary/40 transition-colors"></div>
           </Link>
        </div>
      </section>


    </div>
  );
}
