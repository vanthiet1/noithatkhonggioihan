import Link from 'next/link';
import { Home, MapPin, Phone, Clock, ChevronRight, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Top Banner */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Sẵn sàng nâng tầm không gian sống của bạn?</h3>
            <p className="text-gray-300">Liên hệ ngay để được tư vấn & nhận báo giá miễn phí!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a href="tel:0766444789" className="flex items-center gap-2 border border-white/30 hover:bg-white/10 px-6 py-3.5 rounded-full transition font-semibold">
              <PhoneCall className="w-5 h-5" />
              0766.444.789
            </a>
            <a href="tel:0766444789" className="bg-[#F5A623] hover:bg-[#d98d1a] text-[#0b3d2c] px-6 py-3.5 rounded-full font-bold transition">
              NHẬN TƯ VẤN MIỄN PHÍ
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-10 h-10 text-[#F5A623] shrink-0" strokeWidth={1.5} />
              <h3 className="font-bold text-lg uppercase tracking-wider leading-tight">NỘI THẤT<br/>KHÔNG GIỚI HẠN</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Chuyên thi công cửa lưới chống muỗi, tấm ốp tường Nano, giấy dán tường, rèm cửa, tranh dán tường tại Đà Nẵng & Quảng Nam.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://zalo.me/0766444789" className="w-11 h-11 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[#0068FF]/50 transition-all duration-300 text-sm font-bold" target="_blank" rel="noopener noreferrer" title="Zalo">
                Zalo
              </a>
              <a href="https://www.facebook.com/noithatkhonggioihan" className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[#1877F2]/50 transition-all duration-300" target="_blank" rel="noopener noreferrer" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UC53MggDP9Q9iWIeH5pvl_VA" className="w-11 h-11 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[#FF0000]/50 transition-all duration-300" target="_blank" rel="noopener noreferrer" title="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="tel:0766444789" className="w-11 h-11 rounded-full bg-[#F5A623] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[#F5A623]/50 transition-all duration-300" title="Hotline">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Cột 2 */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">VỀ CHÚNG TÔI</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {[
                { label: 'Giới thiệu', href: '/ve-chung-toi' },
                { label: 'Tin tức', href: '/tin-tuc' },
                { label: 'Liên hệ', href: '/lien-he' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-[#F5A623] transition flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">SẢN PHẨM - DỊCH VỤ</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {[
                { label: 'Cửa lưới chống muỗi', href: '/danh-muc/cua-luoi-chong-muoi-da-nang' },
                { label: 'Tấm ốp tường Nano', href: '/danh-muc/tam-op-tuong-nano-da-nang' },
                { label: 'Giấy dán tường', href: '/danh-muc/giay-dan-tuong-da-nang' },
                { label: 'Rèm cửa cao cấp', href: '/danh-muc/rem-cua-da-nang' },
                { label: 'Tranh dán tường 3D', href: '/danh-muc/tranh-dan-tuong-3d-da-nang' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-[#F5A623] transition flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4 */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">THÔNG TIN LIÊN HỆ</h3>
            <div className="space-y-5 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-1">Vũ Tiến Trường</div>
                  180 Nguyễn Bá Loan, Hòa Xuân, Đà Nẵng
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F5A623] shrink-0" />
                <a href="tel:0766444789" className="hover:text-[#F5A623] transition font-medium">
                  0766.444.789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#F5A623] shrink-0" />
                <span>08:00 - 21:00 (Thứ 2 - CN)</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-300">
        <p>Copyright@2026 <Link href="/" className="hover:text-white transition font-semibold">Nội Thất Không Giới Hạn</Link></p>
      </div>
    </footer>
  );
}

