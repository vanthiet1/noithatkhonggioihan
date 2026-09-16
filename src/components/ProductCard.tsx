import Link from 'next/link';
import { Phone } from 'lucide-react';
import SafeImage from '@/components/SafeImage';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    original_price?: string;
    sale_price?: string;
    categories?: {
      name: string;
    } | { name: string }[] | any;
  };
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const calculateDiscount = (original?: string, sale?: string) => {
    if (!original || !sale) return 0;
    const origNum = parseInt(original.replace(/\D/g, ''));
    const saleNum = parseInt(sale.replace(/\D/g, ''));
    if (origNum && saleNum && origNum > saleNum) {
      return Math.round(((origNum - saleNum) / origNum) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount(product.original_price, product.sale_price);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col relative h-full">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-0 left-0 z-10 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-tl-xl rounded-br-xl shadow-md">
          -{discount}%
        </div>
      )}

      <div className="relative w-[calc(100%+10px)] -mx-[5px] overflow-hidden bg-gray-50 flex items-center justify-center">
        <Link href={`/danh-muc-san-pham/${product.slug}`} className="block w-full">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500" 
          />
        </Link>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">
          {(Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name) || 'Sản phẩm'}
        </p>
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 hover:text-secondary transition min-h-[48px]">
          <Link href={`/danh-muc-san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        
        <div className="mt-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.original_price && discount > 0 && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {product.original_price}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {product.sale_price || product.original_price || 'Liên hệ'}
            </span>
          </div>
          <div className="flex flex-col pt-3 border-t border-gray-50 gap-2">
            <a href="tel:0766444789" className="w-full text-xs font-semibold text-primary hover:text-white hover:bg-primary transition text-center border border-primary rounded-lg py-2">
              Liên Hệ: 0766.444.789
            </a>
            <a href="tel:0766444789" className="w-full bg-primary text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-sky-800 transition shadow-sm">
              <Phone className="w-3.5 h-3.5" />
              Nhận Báo Giá
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
