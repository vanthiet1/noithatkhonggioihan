import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Target, Award, Wrench, Shield, ThumbsUp, Home, Search, FileText, CheckCircle, ChevronDown, HelpCircle, MapPin } from 'lucide-react';
import { SEO_VE_CHUNG_TOI } from '@/lib/seo';

export const metadata: Metadata = SEO_VE_CHUNG_TOI;


const services = [
  {
    title: 'Cửa Lưới Chống Muỗi',
    desc: 'Giải pháp ngăn muỗi và côn trùng hiệu quả, vẫn đảm bảo lưu thông không khí tự nhiên.',
    href: '/danh-muc-san-pham/cua-luoi-chong-muoi'
  },
  {
    title: 'Tấm Ốp Tường Nano',
    desc: 'Giải pháp hoàn thiện tường và trần hiện đại, chống ẩm, dễ vệ sinh và nâng cao tính thẩm mỹ.',
    href: '/danh-muc-san-pham/tam-op-tuong-tran'
  },
  {
    title: 'Giấy Dán Tường',
    desc: 'Đa dạng mẫu mã, màu sắc và phong cách, giúp làm mới không gian nhanh chóng với chi phí hợp lý.',
    href: '/danh-muc-san-pham/giay-dan-tuong'
  },
  {
    title: 'Rèm Cửa Cao Cấp',
    desc: 'Tư vấn, đo đạc và lắp đặt các dòng rèm cửa phù hợp, góp phần chống nắng, cản nhiệt.',
    href: '/danh-muc-san-pham/rem-cua'
  },
  {
    title: 'Tranh Dán Tường 3D',
    desc: 'Mang đến điểm nhấn nổi bật cho phòng khách, phòng ngủ, quán cà phê, nhà hàng.',
    href: '/danh-muc-san-pham/tranh-dan-tuong-2'
  }
];

const steps = [
  { title: 'Khảo sát', desc: 'Khảo sát thực tế và đo đạc miễn phí tại công trình.' },
  { title: 'Tư vấn', desc: 'Tư vấn giải pháp phù hợp với không gian và ngân sách.' },
  { title: 'Báo giá', desc: 'Lập phương án thi công và báo giá chi tiết, minh bạch.' },
  { title: 'Thi công', desc: 'Tiến hành thi công đúng kỹ thuật, đảm bảo đúng tiến độ.' },
  { title: 'Nghiệm thu', desc: 'Bàn giao và thực hiện bảo hành theo chính sách đã cam kết.' }
];

const values = [
  'Cam kết tư vấn đúng nhu cầu và điều kiện thực tế.',
  'Cam kết thi công đúng phương án đã thống nhất.',
  'Cam kết báo giá minh bạch, không phát sinh chi phí bất hợp lý.',
  'Cam kết sử dụng vật liệu đúng tiêu chuẩn đã tư vấn.',
  'Cam kết bàn giao đúng tiến độ.',
  'Cam kết bảo hành và hỗ trợ sau thi công theo chính sách.'
];

const faqs = [
  {
    q: 'Nội Thất Không Giới Hạn có khảo sát miễn phí không?',
    a: 'Có. Chúng tôi hỗ trợ khảo sát và tư vấn miễn phí tại Đà Nẵng và nhiều khu vực thuộc Quảng Nam.'
  },
  {
    q: 'Có nhận thi công các công trình nhỏ không?',
    a: 'Có. Chúng tôi nhận thi công từ các hạng mục đơn lẻ đến công trình hoàn thiện nhiều hạng mục.'
  },
  {
    q: 'Thời gian thi công mất bao lâu?',
    a: 'Tùy vào diện tích và hạng mục thực hiện. Sau khi khảo sát, chúng tôi sẽ cung cấp tiến độ cụ thể để khách hàng chủ động sắp xếp.'
  },
  {
    q: 'Có bảo hành sau khi bàn giao không?',
    a: 'Có. Tất cả các hạng mục đều được bảo hành theo chính sách áp dụng cho từng loại sản phẩm và dịch vụ.'
  }
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[450px] md:h-[550px] py-16 md:py-0 bg-gray-900 flex items-center">
        <Image 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          alt="Giải pháp nội thất chuyên nghiệp" 
          fill 
          className="object-cover opacity-40" 
          priority
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/30">
              Về Chúng Tôi
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Giải Pháp Nội Thất Chuyên Nghiệp Tại Đà Nẵng & Quảng Nam
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium">
              Nội Thất Không Giới Hạn là đơn vị chuyên tư vấn, cung cấp và thi công các giải pháp nội thất với phương châm “Làm đúng từ khâu tư vấn đến khi bàn giao công trình”.
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-3xl transform translate-x-4 translate-y-4 opacity-20"></div>
                <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[500px] z-10 border-4 border-white">
                  <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80" alt="Hành trình hình thành" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
             </div>
             <div>
               <div className="inline-flex items-center text-primary font-bold tracking-wider uppercase mb-3">
                 <Target className="w-5 h-5 mr-2" /> Câu Chuyện Của Chúng Tôi
               </div>
               <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">Hành Trình Hình Thành Và Phát Triển</h2>
               
               <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                 <p>
                   Nội Thất Không Giới Hạn được xây dựng từ mong muốn mang đến cho khách hàng tại Đà Nẵng và Quảng Nam những giải pháp nội thất chất lượng, bền đẹp và phù hợp với nhu cầu thực tế.
                 </p>
                 <p>
                   Những ngày đầu, chúng tôi chủ yếu thực hiện các công trình nhà phố, căn hộ và cải tạo nội thất với quy mô vừa và nhỏ. Qua từng công trình, đội ngũ không ngừng hoàn thiện kỹ thuật thi công, quy trình làm việc và dịch vụ chăm sóc khách hàng.
                 </p>
                 <p>
                   Đến nay, chúng tôi đã mở rộng phạm vi phục vụ cho đa dạng loại hình công trình như biệt thự, văn phòng, nhà hàng, khách sạn và showroom. Mỗi công trình hoàn thành không chỉ là kết quả của thi công mà còn là sự tin tưởng mà khách hàng dành cho chúng tôi.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Lĩnh Vực Hoạt Động</h2>
            <p className="text-gray-600 text-lg">Chúng tôi cung cấp các giải pháp hoàn thiện nội thất với 5 nhóm dịch vụ trọng tâm được nhiều gia đình và doanh nghiệp tin chọn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{svc.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{svc.desc}</p>
              </div>
            ))}
            
            <div className="bg-primary p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-bold mb-4">Bạn cần tư vấn?</h3>
              <p className="mb-6 opacity-90">Hãy gọi ngay để nhận báo giá chi tiết và khảo sát miễn phí tận nơi.</p>
              <a href="tel:0766444789" className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg w-full" rel="nofollow">
                Gọi: 0766.444.789
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Quy Trình Làm Việc Chuyên Nghiệp</h2>
            <p className="text-gray-600 text-lg">Để mỗi công trình được triển khai hiệu quả, chúng tôi áp dụng quy trình làm việc gồm 5 bước minh bạch, giúp khách hàng dễ dàng theo dõi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                {/* Connector line for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-sky-100"></div>
                )}
                
                <div className="w-20 h-20 rounded-full bg-white border-4 border-sky-100 flex items-center justify-center text-2xl font-bold text-primary mb-6 relative z-10 shadow-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES & PROMISES */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 leading-tight">Điều Chúng Tôi Luôn Thực Hiện Trong Mọi Công Trình</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Chúng tôi tin rằng một công trình chất lượng không chỉ đến từ vật liệu tốt mà còn từ sự tận tâm trong từng giai đoạn thực hiện.
              </p>
              <div className="space-y-4">
                {values.map((val, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-sky-400 mr-4 shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                <MapPin className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Khu Vực Phục Vụ</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Đà Nẵng (Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Cẩm Lệ, Liên Chiểu, Hòa Vang) và Quảng Nam (Hội An, Điện Bàn, Đại Lộc, Duy Xuyên).
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                <Home className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Loại Hình Dự Án</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Nhà phố, Căn hộ chung cư, Biệt thự, Văn phòng, Nhà hàng, Quán cà phê, Khách sạn, Showroom và Trường học.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-gray-600 text-lg">Những thắc mắc phổ biến của khách hàng trước khi quyết định hợp tác cùng Nội Thất Không Giới Hạn.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-2xl border border-gray-100 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-lg text-gray-900">
                  <span className="flex items-center">
                    <HelpCircle className="w-6 h-6 text-primary mr-4 shrink-0" />
                    {faq.q}
                  </span>
                  <span className="transition group-open:rotate-180 text-gray-400 shrink-0">
                    <ChevronDown className="w-6 h-6" />
                  </span>
                </summary>
                <div className="text-gray-600 px-6 pb-6 pt-0 ml-10 text-lg leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bạn vẫn còn thắc mắc?</h3>
            <p className="text-gray-600 mb-8">Đừng ngần ngại liên hệ, đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giải đáp.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/lien-he" className="bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:bg-sky-800 transition shadow-lg shadow-primary/20">
                Liên hệ ngay
              </Link>
              <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-white border-2 border-primary text-primary px-8 py-3.5 rounded-full font-bold hover:bg-sky-50 transition">
                Nhắn tin Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
