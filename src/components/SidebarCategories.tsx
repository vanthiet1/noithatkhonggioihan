"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const mainCategories = [
  {
    title: "Cửa Lưới Chống Muỗi Đà Nẵng",
    href: "/danh-muc/cua-luoi-chong-muoi-da-nang",
    subMenuItems: [
      { title: "Cửa Lưới Chống Trộm Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-chong-trom-da-nang" },
      { title: "Cửa Lưới Cố Định Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-co-dinh-da-nang" },
      { title: "Cửa Lưới Dạng Xếp Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-dang-xep-da-nang" },
      { title: "Cửa Lưới Kết Hợp Rèm Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-ket-hop-rem-da-nang" },
      { title: "Cửa Lưới Không Ray Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-khong-ray-da-nang" },
      { title: "Cửa Lưới Mở Lùa Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-mo-lua-da-nang" },
      { title: "Cửa Lưới Tự Cuốn Đà Nẵng", href: "/danh-muc/cua-luoi-chong-muoi-tu-cuon-da-nang" },
    ]
  },
  {
    title: "Tấm Ốp Tường Nano Đà Nẵng",
    href: "/danh-muc/tam-op-tuong-tran-da-nang",
    subMenuItems: []
  },
  {
    title: "Giấy Dán Tường Đà Nẵng",
    href: "/danh-muc/giay-dan-tuong-da-nang",
    subMenuItems: [
      { title: "3D Hiện Đại Đà Nẵng", href: "/danh-muc/3d-hien-dai-da-nang" },
      { title: "Tranh Bình Hoa Đà Nẵng", href: "/danh-muc/tranh-binh-hoa-da-nang" },
      { title: "Tranh Cảnh Biển Đà Nẵng", href: "/danh-muc/tranh-canh-bien-da-nang" },
      { title: "Tranh Mã Đáo Thành Công Đà Nẵng", href: "/danh-muc/tranh-ma-dao-thanh-cong-da-nang" },
      { title: "Tranh Cá Đà Nẵng", href: "/danh-muc/tranh-ca-da-nang" },
    ]
  },
  {
    title: "Rèm Cửa Đà Nẵng",
    href: "/danh-muc/rem-cua-da-nang",
    subMenuItems: [
      { title: "Rèm Sáo Đà Nẵng", href: "/danh-muc/rem-sao-da-nang" },
      { title: "Rèm Vải Đà Nẵng", href: "/danh-muc/rem-vai-da-nang" },
      { title: "Rèm Cuốn Đà Nẵng", href: "/danh-muc/rem-cuon-da-nang" },
      { title: "Rèm Lá Dọc Đà Nẵng", href: "/danh-muc/rem-la-doc-da-nang" },
      { title: "Rèm Cầu Vồng Đà Nẵng", href: "/danh-muc/rem-cau-vong-da-nang" },
    ]
  },
  {
    title: "Tranh Dán Tường 3D Đà Nẵng",
    href: "/danh-muc/tranh-dan-tuong-2-da-nang",
    subMenuItems: [
      { title: "Tranh Trẻ Em Đà Nẵng", href: "/danh-muc/tranh-tre-em-da-nang" },
      { title: "Tranh Con Đường Đà Nẵng", href: "/danh-muc/tranh-con-duong-da-nang" },
      { title: "Tranh Cánh Thiên Thần Đà Nẵng", href: "/danh-muc/tranh-canh-thien-than-da-nang" },
      { title: "Tranh Anh Hùng Tương Ngộ Đà Nẵng", href: "/danh-muc/tranh-anh-hung-tuong-ngo-da-nang" },
      { title: "Tranh Bản Đồ Đà Nẵng", href: "/danh-muc/tranh-ban-do-da-nang" },
      { title: "Tranh Cafe – Bar – Trà Sữa Đà Nẵng", href: "/danh-muc/tranh-cafe-quan-bar-tra-sua-da-nang" },
    ]
  }
];

export default function SidebarCategories() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,168,232,0.15)] relative overflow-hidden">
      <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase flex items-center relative z-10">
        DANH MỤC SẢN PHẨM
      </h3>
      <div className="w-12 h-1 bg-secondary mb-6 relative z-10"></div>
      
      <ul className="space-y-2 relative z-10">
        {mainCategories.map((cat, idx) => (
          <li key={idx} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <div className="flex items-center justify-between group">
              <Link href={cat.href} className="text-gray-700 font-semibold hover:text-secondary transition flex-grow py-2">
                {cat.title}
              </Link>
              {cat.subMenuItems.length > 0 && (
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="p-2 -mr-2 text-gray-400 hover:text-secondary transition"
                  aria-label="Toggle Submenu"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            
            {/* Submenu */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? 'max-h-96 opacity-100 mt-2 mb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="pl-4 border-l-2 border-sky-100 space-y-2 py-1">
                {cat.subMenuItems.map((sub, sIdx) => (
                  <li key={sIdx}>
                    <Link href={sub.href} className="text-sm text-gray-500 hover:text-primary transition block py-1">
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
