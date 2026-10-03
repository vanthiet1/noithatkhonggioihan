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
        "@type": "WebSite",
        "name": "Nội Thất Không Giới Hạn",
        "url": process.env.NEXT_PUBLIC_BASE_URL || "https://noithatkhonggioihan.com",
      },
      {
        "@type": "LocalBusiness",
        "name": "Nội Thất Không Giới Hạn",
        "image": "/logo.png",
        "@id": "",
        "url": process.env.NEXT_PUBLIC_BASE_URL || "https://noithatkhonggioihan.com",
        "telephone": "0766444789",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "180 Nguyễn Bá Loan, Hòa Xuân",
          "addressLocality": "Đà Nẵng",
          "addressRegion": "Đà Nẵng",
          "addressCountry": "VN"
        },
        "openingHoursSpecification": {
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
        },
        "sameAs": [
          "https://www.facebook.com/noithatkhonggioihan",
          "https://www.youtube.com/channel/UC53MggDP9Q9iWIeH5pvl_VA"
        ]
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

              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-10869121978/xVTdCJmyzKoDELrH5r4o',
                    'event_callback': callback
                });
                return false;
              }

              if (typeof document !== 'undefined') {
                document.addEventListener('click', function(e) {
                  var target = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
                  if (target) {
                    gtag('event', 'conversion', {
                      'send_to': 'AW-10869121978/xVTdCJmyzKoDELrH5r4o'
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
