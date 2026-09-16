import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ',
  description: 'Liên hệ Nội Thất Không Giới Hạn để được tư vấn miễn phí, báo giá và khảo sát tận nơi tại Đà Nẵng & Quảng Nam. Hotline: 0766.444.789.',
  keywords: 'liên hệ nội thất đà nẵng, tư vấn nội thất miễn phí, báo giá nội thất đà nẵng, hotline nội thất',
  openGraph: {
    title: 'Liên Hệ',
    description: 'Liên hệ để được tư vấn miễn phí, báo giá và khảo sát tận nơi. Hotline: 0766.444.789.',
    url: 'https://noithatkhonggioihan.com/lien-he',
  }
};

export default function LienHeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
