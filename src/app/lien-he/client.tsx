'use client';

import { Mail, MapPin, Phone, Send, CheckCircle, Clock, Globe, ShieldCheck, PhoneCall, MessageCircle } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact } from '@/app/actions/contact';
import Image from 'next/image';
import Link from 'next/link';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-sky-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'Đang gửi...' : <><Send className="w-5 h-5" /> Gửi yêu cầu tư vấn</>}
    </button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContact, null);

  const benefits = [
    'Khảo sát và đo đạc tận nơi hoàn toàn miễn phí.',
    'Tư vấn giải pháp phù hợp với nhu cầu và ngân sách.',
    'Báo giá chi tiết, minh bạch từng hạng mục.',
    'Nhiều phương án lựa chọn phù hợp với từng không gian.',
    'Thi công đúng kỹ thuật, đúng tiến độ.',
    'Chính sách bảo hành và hỗ trợ sau thi công rõ ràng.'
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[400px] md:h-[450px] bg-slate-900 flex items-center justify-center">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" 
          alt="Liên hệ Nội Thất Không Giới Hạn" 
          fill 
          className="object-cover opacity-30" 
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-bold mb-6 tracking-wider uppercase backdrop-blur-md border border-white/20">
            Dịch vụ của chúng tôi
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Liên Hệ Tư Vấn
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Khảo sát tận nơi • Tư vấn đúng nhu cầu • Báo giá minh bạch • Thi công đúng cam kết
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
        
        {/* CALL TO ACTION BANNER */}
        <div className="bg-gradient-to-r from-sky-700 to-sky-500 rounded-2xl p-8 md:p-10 text-center text-white shadow-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">NHẬN TƯ VẤN VÀ BÁO GIÁ MIỄN PHÍ</h2>
          <p className="text-sky-100 mb-8 text-lg">Khảo sát miễn phí • Báo giá minh bạch • Thi công đúng tiến độ • Bảo hành chu đáo</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:0766444789" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg flex items-center justify-center gap-2 text-lg" rel="nofollow">
              <PhoneCall className="w-5 h-5" /> Gọi Tư Vấn Ngay
            </a>
            <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 px-8 rounded-full transition shadow-lg flex items-center justify-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" /> Chat Zalo
            </a>
          </div>
          <p className="mt-6 text-sm text-sky-100 opacity-90">
            Gửi hình ảnh hoặc kích thước công trình qua Zalo để được tư vấn giải pháp phù hợp và nhận báo giá miễn phí.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Khi Liên Hệ Với Nội Thất Không Giới Hạn, Bạn Sẽ Nhận Được</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-sky-500 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-sky-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dịch Vụ Thi Công</h3>
                <ul className="space-y-3 text-gray-600 text-sm">
                  <li><Link href="https://www.noithatkhonggioihan.com/tin-tuc/cua-luoi-chong-muoi-tai-da-nang-giai-phap-giu-nha-thong-thoang-han-che-con-trung" className="hover:text-primary transition-colors">• Cửa Lưới Chống Muỗi</Link></li>
                  <li><Link href="https://www.noithatkhonggioihan.com/tin-tuc/tam-op-tuong-nano-tai-da-nang-giai-phap-cai-tao-khong-gian-dep-ben" className="hover:text-primary transition-colors">• Tấm Ốp Tường Nano</Link></li>
                  <li><Link href="https://www.noithatkhonggioihan.com/tin-tuc/giay-dan-tuong-tai-da-nang-giai-phap-trang-tri-tuong-nhanh-dep" className="hover:text-primary transition-colors">• Giấy Dán Tường</Link></li>
                  <li><Link href="https://www.noithatkhonggioihan.com/tin-tuc/rem-cua-da-nang-mau-dep-cho-nha-o-van-phong-va-cua-hang" className="hover:text-primary transition-colors">• Rèm Cửa Cao Cấp</Link></li>
                  <li><Link href="https://www.noithatkhonggioihan.com/tin-tuc/tranh-dan-tuong-tai-da-nang-thiet-ke-theo-kich-thuoc-khong-gian" className="hover:text-primary transition-colors">• Tranh Dán Tường 3D</Link></li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-sky-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Khu Vực Khảo Sát</h3>
                <p className="text-gray-600 text-sm mb-3"><strong>Đà Nẵng:</strong> Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Cẩm Lệ, Liên Chiểu, Hòa Vang.</p>
                <p className="text-gray-600 text-sm"><strong>Quảng Nam:</strong> Hội An, Điện Bàn, Đại Lộc, Duy Xuyên, Thăng Bình.</p>
              </div>
            </div>

            {/* Map moved to left column to balance height */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.8!2d108.2!3d15.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDU4JzEyLjAiTiAxMDjCsDEyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1600000000000!5m2!1svi!2s"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="Bản đồ Nội Thất Không Giới Hạn"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: The Form & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">
              {/* Form Design */}
              {state?.success ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-sky-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Gửi thành công!</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">Cảm ơn bạn đã liên hệ. Đội ngũ của Nội Thất Không Giới Hạn sẽ phản hồi bạn sớm nhất có thể.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Để lại lời nhắn</h3>
                  <p className="text-gray-500 mb-8 text-sm">Chúng tôi sẽ gọi lại ngay khi nhận được thông tin.</p>

                  {state?.error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 mb-6 text-sm">
                      {state.error}
                    </div>
                  )}

                  <form action={formAction} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-gray-50 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        pattern="[0-9]{10,11}"
                        title="Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)"
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-gray-50 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tin nhắn</label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Bạn cần tư vấn về sản phẩm nào?"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none bg-gray-50 text-gray-900"
                      />
                    </div>
                    <SubmitBtn />
                  </form>
                </>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="bg-gray-900 text-white rounded-3xl shadow-lg p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" /> Văn phòng của chúng tôi
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400 mb-1">Địa điểm Văn phòng</span>
                    <span className="font-medium">180 Nguyễn Bá Loan, Hòa Xuân, Đà Nẵng</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400 mb-1">Gửi email</span>
                    <span className="font-medium">tientruong.dtvt@gmail.com</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400 mb-1">Gọi trực tiếp hoặc qua Zalo</span>
                    <span className="font-medium">0766 444 789</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-400 mb-1">Giờ làm việc</span>
                    <span className="font-medium block">Thứ Hai - Chủ Nhật: 08:00 - 21:00</span>
                    <span className="font-medium block text-gray-300 text-sm mt-0.5">Hỗ trợ theo lịch hẹn</span>
                    <span className="font-medium block text-gray-300 text-sm mt-0.5">Hotline: 08:00 - 21:00</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
