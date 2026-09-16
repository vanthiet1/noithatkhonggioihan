"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, MapPin, Clock, Gift, MessageCircle, Search, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const initialCategories = [
  {
    title: "Cửa Lưới Chống Muỗi Đà Nẵng",
    href: "/danh-muc/cua-luoi-chong-muoi-da-nang",
    subMenuItems: [
      { title: "Cửa Lưới Chống Trộm", href: "/danh-muc/cua-luoi-chong-muoi-chong-trom-da-nang" },
      { title: "Cửa Lưới Cố Định", href: "/danh-muc/cua-luoi-chong-muoi-co-dinh-da-nang" },
      { title: "Cửa Lưới Dạng Xếp", href: "/danh-muc/cua-luoi-chong-muoi-dang-xep-da-nang" },
      { title: "Cửa Lưới Kết Hợp Rèm", href: "/danh-muc/cua-luoi-chong-muoi-ket-hop-rem-da-nang" },
      { title: "Cửa Lưới Không Ray", href: "/danh-muc/cua-luoi-chong-muoi-khong-ray-da-nang" },
      { title: "Cửa Lưới Mở Lùa", href: "/danh-muc/cua-luoi-chong-muoi-mo-lua-da-nang" },
      { title: "Cửa Lưới Tự Cuốn", href: "/danh-muc/cua-luoi-chong-muoi-tu-cuon-da-nang" },
    ]
  },
  {
    title: "Tấm Ốp Tường Nano Đà Nẵng",
    href: "/danh-muc/tam-op-tuong-nano-da-nang",
    subMenuItems: []
  },
  {
    title: "Giấy Dán Tường Đà Nẵng",
    href: "/danh-muc/giay-dan-tuong-da-nang",
    subMenuItems: []
  },
  {
    title: "Rèm Cửa Đà Nẵng",
    href: "/danh-muc/rem-cua-da-nang",
    subMenuItems: [
      { title: "Rèm Sáo", href: "/danh-muc/rem-sao-da-nang" },
      { title: "Rèm Vải", href: "/danh-muc/rem-vai-da-nang" },
      { title: "Rèm Cuốn", href: "/danh-muc/rem-cuon-da-nang" },
      { title: "Rèm Lá Dọc", href: "/danh-muc/rem-la-doc-da-nang" },
      { title: "Rèm Cầu Vồng", href: "/danh-muc/rem-cau-vong-da-nang" },
    ]
  },
  {
    title: "Tranh Dán Tường Đà Nẵng",
    href: "/danh-muc/tranh-dan-tuong-da-nang",
    subMenuItems: [
      { title: "3D Hiện Đại", href: "/danh-muc/3d-hien-dai" },
      { title: "Tranh Anh Hùng Tương Ngộ", href: "/danh-muc/tranh-anh-hung-tuong-ngo" },
      { title: "Tranh Bản Đồ", href: "/danh-muc/tranh-ban-do" },
      { title: "Tranh Bình Hoa", href: "/danh-muc/tranh-binh-hoa" },
      { title: "Tranh Cá", href: "/danh-muc/tranh-ca" },
      { title: "Tranh Cafe - Quán Bar - Trà Sữa", href: "/danh-muc/tranh-cafe-quan-bar-tra-sua" },
      { title: "Tranh Cảnh Biển", href: "/danh-muc/tranh-canh-bien" },
      { title: "Tranh Cánh Thiên Thần", href: "/danh-muc/tranh-canh-thien-than" },
      { title: "Tranh Con Đường", href: "/danh-muc/tranh-con-duong" },
      { title: "Tranh Mã Đáo Thành Công", href: "/danh-muc/tranh-ma-dao-thanh-cong" },
      { title: "Tranh Trẻ Em", href: "/danh-muc/tranh-tre-em" },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState<number | null>(null);
  const [hoveredCat, setHoveredCat] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [navCategories, setNavCategories] = useState<any[]>(initialCategories);
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, sub_categories(id, name, slug)')
        .order('name');
        
      if (data && !error && isMounted) {
        const formatted = data.map((cat: any) => ({
          title: cat.name,
          href: `/danh-muc/${cat.slug}`,
          subMenuItems: (cat.sub_categories || []).map((sub: any) => ({
            title: sub.name,
            href: `/danh-muc/${sub.slug}`
          }))
        }));
        setNavCategories(formatted);
      }
    };
    
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, image_url, sale_price, original_price')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);
      setSearchResults(data || []);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, supabase]);

  // Khóa cuộn trang (scroll) khi mở menu mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function để đảm bảo tắt menu thì body scroll lại bình thường
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-white py-1.5 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-[13px]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5" /> 180 Nguyễn Bá Loan, Hòa Xuân, Đà Nẵng</span>
            <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" /> 0766.444.789</span>
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> 08:00 - 21:00</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Gift className="w-3.5 h-3.5 mr-1.5" /> Nhiều ưu đãi theo từng hạng mục thi công</span>
            <span className="opacity-50">|</span>
            <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" /> Liên hệ để được tư vấn chi tiết</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <Image
              src="/logo.png"
              alt="Nội Thất Không Giới Hạn"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="text-primary font-extrabold text-lg uppercase tracking-wide">Nội Thất</span>
              <span className="text-secondary font-bold text-sm uppercase tracking-widest">Không Giới Hạn</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link href="/" className={`font-medium transition px-4 py-2 rounded-xl ${pathname === '/' ? 'bg-sky-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-sky-50/50'}`}>Trang chủ</Link>

            {/* Mega Menu Danh mục */}
            <div className="relative group h-full flex items-center">
              <div className="flex items-center font-medium transition py-5">
                <Link href="/dich-vu" className={`flex items-center px-4 py-2 rounded-xl transition ${pathname.startsWith('/dich-vu') || pathname.startsWith('/danh-muc') ? 'bg-sky-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-sky-50/50 group-hover:text-primary'}`}>
                  Danh mục sản phẩm <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
                </Link>
              </div>

              <div className={`absolute left-0 top-[85%] hidden group-hover:flex bg-white shadow-2xl rounded-b-2xl border-t-4 border-primary overflow-hidden min-h-[300px] pt-0 ${navCategories[hoveredCat]?.subMenuItems.length > 0 ? 'w-[700px]' : 'w-[280px]'}`}>
                {/* Invisible bridge to keep hover state active */}
                <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                
                {/* Categories List (Left) */}
                <div className={`${navCategories[hoveredCat]?.subMenuItems.length > 0 ? 'w-2/5' : 'w-full'} bg-gray-50 border-r border-gray-100 py-4`}>
                  {navCategories.map((cat, idx) => {
                    const isActive = pathname === cat.href;
                    return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredCat(idx)}
                      className={`px-6 py-3 cursor-pointer transition ${
                        hoveredCat === idx || isActive
                          ? 'bg-white border-l-4 border-primary text-primary shadow-[inset_4px_0_0_0_rgba(0,168,232,0.1)]'
                          : 'border-l-4 border-transparent text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Link href={cat.href} className="font-semibold block text-sm uppercase tracking-wide">
                        {cat.title}
                      </Link>
                    </div>
                  )})}
                </div>

                {/* Sub-categories List (Right) */}
                {navCategories[hoveredCat]?.subMenuItems.length > 0 && (
                  <div className="w-3/5 p-8 bg-white">
                    <Link href={navCategories[hoveredCat]?.href || '#'} className={`inline-block text-lg font-bold mb-6 transition border-b-2 pb-1 ${pathname === navCategories[hoveredCat]?.href ? 'text-secondary border-secondary' : 'text-primary border-primary hover:text-sky-800'}`}>
                      {navCategories[hoveredCat]?.title}
                    </Link>

                    <ul className="grid grid-cols-2 gap-y-4 gap-x-6">
                      {navCategories[hoveredCat].subMenuItems.map((sub: any, subIdx: number) => {
                        const isSubActive = pathname === sub.href;
                        return (
                        <li key={subIdx}>
                          <Link href={sub.href} className={`text-sm transition flex items-center group/item ${isSubActive ? 'text-secondary font-bold' : 'text-gray-600 hover:text-primary'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 shrink-0 transition-colors ${isSubActive ? 'bg-secondary' : 'bg-gray-300 group-hover/item:bg-secondary'}`}></span>
                            {sub.title}
                          </Link>
                        </li>
                      )})}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Link href="/tin-tuc" className={`font-medium transition px-4 py-2 rounded-xl ${pathname === '/tin-tuc' ? 'bg-sky-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-sky-50/50'}`}>Tin tức</Link>
            <Link href="/ve-chung-toi" className={`font-medium transition px-4 py-2 rounded-xl ${pathname === '/ve-chung-toi' ? 'bg-sky-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-sky-50/50'}`}>Về Chúng Tôi</Link>
            <Link href="/lien-he" className={`font-medium transition px-4 py-2 rounded-xl ${pathname === '/lien-he' ? 'bg-sky-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-sky-50/50'}`}>Liên hệ</Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+84766444789" className="bg-primary hover:bg-sky-800 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center shadow-sm text-sm" rel="nofollow">
              <Phone className="w-4 h-4 mr-2 fill-current" />
              0766.444.789
            </a>
            <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-white border border-primary text-primary hover:bg-sky-50 px-5 py-2.5 rounded-xl font-bold transition flex items-center shadow-sm text-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Zalo
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-primary focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t overflow-y-auto max-h-[calc(100vh-80px)] pb-10">
          <div className="px-2 pt-4 pb-3 space-y-1 sm:px-3">
            
            {/* Search Box */}
            <div className="px-3 mb-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-primary focus:border-primary block pl-10 p-2.5 transition outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                   {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Search className="w-4 h-4" />}
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery.trim() !== '' && (
                <div className="absolute z-50 w-[calc(100%-24px)] left-3 right-3 mt-1 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden max-h-[300px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      {searchResults.map((product) => (
                        <Link 
                          key={product.id} 
                          href={`/danh-muc-san-pham/${product.slug}`}
                          onClick={() => { setIsOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <Image src={product.image_url || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=100&q=80'} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</span>
                            <span className="text-[11px] text-primary font-bold mt-0.5">{product.sale_price || product.original_price || 'Liên hệ'}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : !isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500">Không tìm thấy sản phẩm nào</div>
                  ) : null}
                </div>
              )}
            </div>

            <Link href="/" onClick={() => setIsOpen(false)} className={`block px-3 py-2 text-base font-medium rounded-md ${pathname === '/' ? 'text-primary bg-sky-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>Trang chủ</Link>
            <Link href="/dich-vu" onClick={() => setIsOpen(false)} className={`block px-3 py-2 text-base font-medium rounded-md ${pathname === '/dich-vu' ? 'text-primary bg-sky-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>Danh mục sản phẩm</Link>

            {navCategories.map((cat, idx) => {
              const isCatActive = pathname === cat.href;
              return (
              <div key={idx}>
                {cat.subMenuItems.length === 0 ? (
                  <Link
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex justify-between items-center px-3 py-2 text-base font-medium rounded-md ${isCatActive ? 'text-primary bg-sky-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                  >
                    {cat.title}
                  </Link>
                ) : (
                  <>
                    <div className={`flex justify-between items-center px-3 py-1 text-base font-medium rounded-md ${isCatActive ? 'bg-sky-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
                      <Link
                        href={cat.href}
                        onClick={() => setIsOpen(false)}
                        className="flex-grow py-1"
                      >
                        {cat.title}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenMobileCat(openMobileCat === idx ? null : idx);
                        }}
                        className={`p-2 -mr-2 focus:outline-none ${isCatActive ? 'text-primary hover:text-sky-800' : 'text-gray-500 hover:text-primary'}`}
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${openMobileCat === idx ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {openMobileCat === idx && (
                      <div className="pl-4 space-y-1 pb-2 max-h-[300px] overflow-y-auto">
                        {cat.subMenuItems.map((sub: any, subIdx: number) => {
                          const isSubActive = pathname === sub.href;
                          return (
                          <Link key={subIdx} href={sub.href} onClick={() => setIsOpen(false)} className={`block px-3 py-1.5 text-sm rounded-md ${isSubActive ? 'text-secondary font-bold bg-gray-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>
                            {sub.title}
                          </Link>
                        )})}
                      </div>
                    )}
                  </>
                )}
              </div>
            )})}

            <Link href="/tin-tuc" onClick={() => setIsOpen(false)} className={`block px-3 py-2 text-base font-medium rounded-md ${pathname.startsWith('/tin-tuc') ? 'text-primary bg-sky-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>Tin tức</Link>
            <Link href="/ve-chung-toi" onClick={() => setIsOpen(false)} className={`block px-3 py-2 text-base font-medium rounded-md ${pathname.startsWith('/ve-chung-toi') ? 'text-primary bg-sky-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>Về Chúng Tôi</Link>
            <Link href="/lien-he" onClick={() => setIsOpen(false)} className={`block px-3 py-2 text-base font-medium rounded-md ${pathname.startsWith('/lien-he') ? 'text-primary bg-sky-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>Liên hệ</Link>
            <div className="px-3 py-2 space-y-2">
              <a href="tel:+84766444789" className="bg-primary text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center w-full text-sm shadow-sm" rel="nofollow">
                <Phone className="w-4 h-4 mr-2 fill-current" /> 0766.444.789
              </a>
              <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-white border border-primary text-primary px-4 py-2 rounded-xl font-medium flex items-center justify-center w-full text-sm shadow-sm">
                <MessageCircle className="w-4 h-4 mr-2" /> Nhắn tin Zalo
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
