import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins', // Keep variable name so we don't break tailwind config, though it's technically Inter now
  display: 'swap',
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL as string),
  // Fallback toàn site — từng trang override qua seo.ts
  title: {
    default: 'Nội Thất Không Giới Hạn - Đà Nẵng',
    template: '%s | Nội Thất Không Giới Hạn',
  },
  description: 'Chuyên tư vấn, cung cấp và thi công các giải pháp nội thất tại Đà Nẵng & Quảng Nam.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://www.noithatkhonggioihan.com/#organization",
        "name": "Nội Thất Không Giới Hạn",
        "alternateName": "Nội Thất Không Giới Hạn Đà Nẵng",
        "url": "https://www.noithatkhonggioihan.com/",
        "logo": "https://www.noithatkhonggioihan.com/logo.png",
        "image": "https://www.noithatkhonggioihan.com/logo.png",
        "description": "Nội Thất Không Giới Hạn chuyên tư vấn, cung cấp và thi công cửa lưới chống muỗi, tấm ốp tường Nano, giấy dán tường, tranh dán tường và rèm cửa tại Đà Nẵng.",
        "telephone": "+84766444789",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "180 Nguyễn Bá Loan, Hòa Xuân",
          "addressLocality": "Đà Nẵng",
          "addressCountry": "VN"
        },
        "areaServed": [
          {
            "@type": "Place",
            "name": "Đà Nẵng, Việt Nam"
          },
          {
            "@type": "Place",
            "name": "Quảng Nam, Việt Nam"
          }
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "08:00",
            "closes": "21:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/noithatkhonggioihan",
          "https://www.youtube.com/channel/UC53MggDP9Q9iWIeH5pvl_VA",
          "https://www.efunda.com/members/people/show_people.cfm?Usr=noithatkhongg",
          "https://egamerprofile.com/player/noithatkhonggtw",
          "https://forum.issabel.org/u/noithatkhongg",
          "https://odesli.co/zsc35g0hdhhcf",
          "https://solo.to/noithatkhongg",
          "https://cybermos.ru/user/262421/",
          "http://jobboard.piasd.org/author/noithatkhongg/",
          "https://md.sebastians.dev/s/xuAYrRjM8",
          "https://www.weddingvendors.com/directory/profile/52158/",
          "https://aiti.edu.vn/members/noithatkhongg.75364/",
          "https://www.preferredprofessionals.com/actuaries/n%E1%BB%99i-th%E1%BA%A5t-kh%C3%B4ng-gi%E1%BB%9Bi-h%E1%BA%A1n",
          "https://awan.pro/forum/user/221114/",
          "https://onespotsocial.com/noithatkhongg",
          "https://www.klynt.net/members/noithatkhongg",
          "http://delphi.larsbo.org/user/noithatkhongg",
          "https://phijkchu.com/a/noithatkhongg/video-channels",
          "https://dreevoo.com/profile_info.php?pid=2395888",
          "https://forums.maxperformanceinc.com/forums/member.php?u=262982",
          "https://md.kif.rocks/s/Xhu5nkVdOk",
          "https://learningapps.org/display?v=pacsadtfj26",
          "http://www.muzikspace.com/profiledetails.aspx?profileid=161542",
          "https://businesslistingplus.com/profile/noithatkhongg/",
          "https://bio.site/noithatkhongg",
          "https://promosimple.com/ps/510bb/noithatkhongg",
          "https://song.link/noithatkhongg",
          "https://soundation.com/user/noithatkhongg",
          "https://www.geogebra.org/m/cqfgyvub"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Dịch vụ nội thất tại Đà Nẵng",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Cửa lưới chống muỗi Đà Nẵng",
              "url": "https://www.noithatkhonggioihan.com/tin-tuc/cua-luoi-chong-muoi-tai-da-nang-giai-phap-giu-nha-thong-thoang-han-che-con-trung"
            },
            {
              "@type": "OfferCatalog",
              "name": "Tấm ốp tường Nano Đà Nẵng",
              "url": "https://www.noithatkhonggioihan.com/tin-tuc/tam-op-tuong-nano-tai-da-nang-giai-phap-cai-tao-khong-gian-dep-ben"
            },
            {
              "@type": "OfferCatalog",
              "name": "Giấy dán tường Đà Nẵng",
              "url": "https://www.noithatkhonggioihan.com/tin-tuc/giay-dan-tuong-tai-da-nang-giai-phap-trang-tri-tuong-nhanh-dep"
            },
            {
              "@type": "OfferCatalog",
              "name": "Rèm cửa Đà Nẵng",
              "url": "https://www.noithatkhonggioihan.com/tin-tuc/rem-cua-da-nang-mau-dep-cho-nha-o-van-phong-va-cua-hang"
            },
            {
              "@type": "OfferCatalog",
              "name": "Tranh dán tường Đà Nẵng",
              "url": "https://www.noithatkhonggioihan.com/tin-tuc/tranh-dan-tuong-tai-da-nang-thiet-ke-theo-kich-thuoc-khong-gian"
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.noithatkhonggioihan.com/#website",
        "url": "https://www.noithatkhonggioihan.com/",
        "name": "Nội Thất Không Giới Hạn",
        "inLanguage": "vi-VN",
        "publisher": {
          "@id": "https://www.noithatkhonggioihan.com/#organization"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.noithatkhonggioihan.com/#webpage",
        "url": "https://www.noithatkhonggioihan.com/",
        "name": "Nội Thất Không Giới Hạn - Thi Công Nội Thất Đà Nẵng",
        "description": "Chuyên tư vấn và thi công nội thất tại Đà Nẵng gồm cửa lưới chống muỗi, tấm ốp tường Nano, giấy dán tường, rèm cửa và tranh dán tường.",
        "isPartOf": {
          "@id": "https://www.noithatkhonggioihan.com/#website"
        },
        "about": {
          "@id": "https://www.noithatkhonggioihan.com/#organization"
        },
        "inLanguage": "vi-VN"
      }
    ]
  };

  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N7Q3MV5');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-10869121978"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-10869121978');

              // 1. Chuyển đổi cuộc gọi di động (call mobile)
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                var isZalo = url && (typeof url === 'string') && url.indexOf('zalo.me') !== -1;
                var sendTo = isZalo ? 'AW-10869121978/0XEoCMrlpq0DELrH5r4o' : 'AW-10869121978/xVTdCJmyzKoDELrH5r4o';
                gtag('event', 'conversion', {
                    'send_to': sendTo,
                    'value': 0.0,
                    'currency': 'VND',
                    'transaction_id': '',
                    'event_callback': callback
                });
                return false;
              }

              // 2. Chuyển đổi mua hàng / đặt hàng qua Zalo ([f433] purchase action)
              function gtag_report_purchase(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-10869121978/0XEoCMrlpq0DELrH5r4o',
                    'value': 0.0,
                    'currency': 'VND',
                    'transaction_id': '',
                    'event_callback': callback
                });
                return false;
              }

              // Tự động bắt sự kiện click nút Gọi điện thoại và nút Chat Zalo trên toàn website
              if (typeof document !== 'undefined') {
                document.addEventListener('click', function(e) {
                  // Cuộc gọi (call mobile)
                  var telTarget = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
                  if (telTarget) {
                    gtag('event', 'conversion', {
                      'send_to': 'AW-10869121978/xVTdCJmyzKoDELrH5r4o'
                    });
                  }

                  // Mua hàng / đặt hàng qua Chat Zalo ([f433] purchase action)
                  var zaloTarget = e.target && e.target.closest ? e.target.closest('a[href*="zalo.me"]') : null;
                  if (zaloTarget) {
                    gtag('event', 'conversion', {
                      'send_to': 'AW-10869121978/0XEoCMrlpq0DELrH5r4o',
                      'value': 0.0,
                      'currency': 'VND',
                      'transaction_id': ''
                    });
                  }
                }, true);
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N7Q3MV5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextTopLoader color="#0284c7" showSpinner={false} height={3} shadow="0 0 10px #0284c7,0 0 5px #0284c7" />
        <ClientLayoutWrapper
          header={<Navbar />}
          footer={<Footer />}
          floating={<FloatingContact />}
        >
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
