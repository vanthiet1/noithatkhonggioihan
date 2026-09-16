import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, CheckCircle2, Award, Box, PenTool, 
  Ruler, ShieldCheck, HeartHandshake, PhoneCall, MessageCircle, ChevronDown, MapPin
} from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import SortDropdown from '@/components/SortDropdown';
import { getPublicClient } from '@/utils/supabase/public';
import { buildCategoryMetadata } from '@/lib/seo';

export const revalidate = 3600;

function slugToName(slug: string): string {
  const baseSlug = slug.replace(/-da-nang$/, '');
  const map: Record<string, string> = {
    'cua-luoi-chong-muoi': 'Cửa Lưới Chống Muỗi Đà Nẵng',
    'cua-luoi-chong-muoi-co-dinh': 'Cửa Lưới Chống Muỗi Cố Định Đà Nẵng',
    'cua-luoi-chong-muoi-dang-xep': 'Cửa Lưới Chống Muỗi Dạng Xếp Đà Nẵng',
    'cua-luoi-chong-muoi-ket-hop-rem': 'Cửa Lưới Chống Muỗi Kết Hợp Rèm Đà Nẵng',
    'cua-luoi-chong-muoi-khong-ray': 'Cửa Lưới Chống Muỗi Không Ray Đà Nẵng',
    'cua-luoi-chong-muoi-mo-lua': 'Cửa Lưới Chống Muỗi Mở Lùa Đà Nẵng',
    'cua-luoi-chong-muoi-tu-cuon': 'Cửa Lưới Chống Muỗi Tự Cuốn Đà Nẵng',
    'cua-luoi-chong-trom': 'Cửa Lưới Chống Trộm Đà Nẵng',
    'tam-op-tuong-nano': 'Tấm Ốp Tường Nano Đà Nẵng',
    'tam-op-tuong-tran': 'Tấm Ốp Tường Trần Đà Nẵng',
    'giay-dan-tuong': 'Giấy Dán Tường Đà Nẵng',
    'tranh-dan-tuong': 'Tranh Dán Tường Đà Nẵng',
    'rem-cua': 'Rèm Cửa Đà Nẵng',
    'rem-sao': 'Rèm Sáo Đà Nẵng',
    'rem-vai': 'Rèm Vải Đà Nẵng',
    'rem-cuon': 'Rèm Cuốn Đà Nẵng',
    'rem-la-doc': 'Rèm Lá Dọc Đà Nẵng',
    'rem-cau-vong': 'Rèm Cầu Vồng Đà Nẵng',
  };
  if (map[baseSlug]) return map[baseSlug];
  if (map[slug]) return map[slug];
  // fallback: convert slug to title case
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateStaticParams() {
  const supabase = getPublicClient();
  const [{ data: cats }, { data: subCats }] = await Promise.all([
    supabase.from('categories').select('slug'),
    supabase.from('sub_categories').select('slug')
  ]);
  const params: { slug: string }[] = [];
  cats?.forEach(c => { if (c.slug) params.push({ slug: c.slug }); });
  subCats?.forEach(s => { if (s.slug) params.push({ slug: s.slug }); });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getPublicClient();
  
  // Try to find in categories first
  let { data: cat } = await supabase.from('categories').select('name, description').eq('slug', slug).single();
  
  if (!cat) {
    const { data: subCat } = await supabase.from('sub_categories').select('name, description').eq('slug', slug).single();
    if (subCat) cat = subCat;
  }

  // Use DB name if available, otherwise use slug-to-name mapping
  const title = cat?.name || slugToName(slug);
  return buildCategoryMetadata({ name: title, slug, description: cat?.description });
}

// Hàm hỗ trợ lấy số từ chuỗi giá (ví dụ "150,000 ₫" -> 150000)
const parsePrice = (priceStr?: string) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/\D/g, '')) || 0;
};


// Helper to get dynamic content for MAIN categories (SEO & Ads)
  const getParentCategoryContent = (catSlug: string) => {
    const s = catSlug.toLowerCase();
    const serviceAreas = "Hải Châu, Thanh Khê, Cẩm Lệ, Liên Chiểu, Ngũ Hành Sơn, Sơn Trà, Hòa Vang (Đà Nẵng) và Điện Bàn, Hội An (Quảng Nam).";
    
    if (s.includes('cua-luoi')) {
      return {
        heroHeading: 'CỬA LƯỚI CHỐNG MUỖI ĐÀ NẴNG – TƯ VẤN, ĐO ĐẠC & LẮP ĐẶT TẬN NƠI',
        heroTypes: 'Cửa lưới tự cuốn • Cửa lưới dạng xếp • Cửa lưới mở lùa • Cửa lưới không ray • Cửa lưới nhiều cánh • Cửa lưới cao cấp',
        heroSubtitle: 'Giải pháp giúp hạn chế muỗi và côn trùng xâm nhập, đồng thời giữ cho không gian nhà vẫn thông thoáng, tận dụng được gió và ánh sáng tự nhiên.<br class="hidden sm:inline"/> Phù hợp cho nhà phố, căn hộ, biệt thự, cửa sổ, cửa ban công và cửa kính lớn tại Đà Nẵng.',
        heroCommitments: [
          'Khảo sát tận nơi',
          'Tư vấn theo thực tế',
          'Đo đạc chính xác',
          'Báo giá rõ ràng',
          'Lắp đặt hoàn thiện'
        ],
        heroImage: '/uploads/cua-luoi-hero.jpg',
        heroIcons: [ { icon: ShieldCheck, text: "Lưới Inox<br/>siêu bền" }, { icon: Box, text: "Ngăn côn trùng<br/>100%" }, { icon: PenTool, text: "Không cản<br/>tầm nhìn" }, { icon: Ruler, text: "Thi công<br/>trong ngày" } ],
        benefits: [
          { title: "Ngăn chặn 100% côn trùng gây bệnh", desc: "Lưới đan siêu nhỏ ngăn chặn tuyệt đối muỗi vằn, kiến ba khoang, gián, chuột... bảo vệ sức khỏe gia đình 24/7." },
          { title: "Thoáng mát & Đón ánh sáng tự nhiên", desc: "Thiết kế tàng hình giúp không gian luôn tràn ngập gió mát và ánh sáng, tiết kiệm điện năng điều hòa." },
          { title: "Đầu tư 1 lần - Sử dụng 20 năm", desc: "Khung nhôm định hình tĩnh điện kết hợp lưới Inox 316 hoặc sợi thủy tinh siêu dai, chịu lực tốt, không rỉ sét." },
          { title: "An toàn tuyệt đối - Không hóa chất", desc: "Nói không với các loại thuốc xịt muỗi độc hại. Môi trường sống hoàn toàn tự nhiên, an toàn cho trẻ nhỏ." }
        ],
        faqs: [
          { q: 'Lưới có dễ bị rách không?', a: 'Rất khó rách. Chúng tôi sử dụng lưới Inox 316 hoặc sợi thủy tinh bọc nhựa siêu dai, chịu lực rất tốt kể cả với móng vuốt thú cưng.' },
          { q: 'Lắp cửa lưới có làm tối nhà không?', a: 'Hoàn toàn không. Sợi lưới cực mảnh (chỉ 0.2mm) tạo cảm giác tàng hình ở khoảng cách 2m, không cản sáng hay cản gió.' },
          { q: 'Cửa lưới có vệ sinh được không?', a: 'Rất dễ dàng. Bạn chỉ cần dùng máy hút bụi mini hoặc dùng khăn ẩm lau nhẹ trên bề mặt lưới là sạch bụi bẩn.' },
          { q: 'Bảo hành bao lâu?', a: 'Chúng tôi bảo hành lưới và phụ kiện lên đến 5 năm, hỗ trợ sửa chữa trọn đời tận nơi.' }
        ],
        pricingTable: [ { item: 'Cửa lưới chống muỗi cố định', price: '700.000đ - 750.000đ', unit: 'm2' }, { item: 'Cửa lưới chống muỗi dạng xếp', price: '700.000đ', unit: 'm2' }, { item: 'Cửa lưới chống muỗi mở lùa/mở quay', price: '2.300.000đ', unit: 'm2' }, { item: 'Cửa lưới không ray', price: '1.300.000đ', unit: 'm2' } ],
        projects: [ { title: "Cửa lưới dạng xếp", loc: "Hòa Xuân, Cẩm Lệ", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Cửa lưới lùa vân gỗ", loc: "Euro Village, Sơn Trà", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Cửa lưới cửa chính", loc: "Hải Châu, Đà Nẵng", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Cửa lưới xếp cửa sổ", loc: "Liên Chiểu, Đà Nẵng", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" } ],
        seoArticle: `<h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-5 uppercase tracking-tight">NHÀ BẠN ĐANG ĐÓNG CỬA VÌ MUỖI, HAY CHƯA BIẾT NÊN LẮP CỬA LƯỚI LOẠI NÀO?</h2><p class="text-gray-700 mb-3 leading-relaxed font-medium text-base">Có thể bạn đang tìm cửa lưới vì một trong những tình huống rất quen thuộc:</p><ul class="list-disc pl-6 text-gray-700 mb-5 space-y-2 font-medium text-base"><li>Muốn mở cửa cho thoáng nhưng sợ muỗi bay vào.</li><li>Muốn lắp cửa lưới nhưng không biết cửa nhà mình có lắp được không.</li><li>Thấy rất nhiều loại cửa lưới nhưng không biết loại nào phù hợp.</li><li>Muốn biết giá nhưng chưa biết phải đo kích thước như thế nào.</li></ul><p class="text-gray-700 mb-2 leading-relaxed font-medium text-base">Hoặc đơn giản là:</p><div class="border-l-4 border-primary pl-4 py-2.5 my-3 bg-sky-50/60 rounded-r-lg"><p class="text-gray-900 font-bold italic text-base md:text-lg">“Cửa nhà tôi như thế này thì nên làm cửa lưới loại nào?”</p></div><h3 class="text-xl md:text-2xl font-bold text-primary mt-8 mb-3 uppercase">ĐÂY LÀ LÚC BẠN KHÔNG CẦN TỰ CHỌN.</h3><p class="text-gray-700 mb-3 leading-relaxed font-medium text-base">Cửa sổ, cửa ban công, cửa đi hay cửa kính lớn sẽ có cách lựa chọn khác nhau.</p><p class="text-gray-800 font-bold mb-3 text-base">Chúng tôi sẽ xem xét:</p><ul class="list-disc pl-6 text-gray-700 mb-5 space-y-2 font-medium text-base"><li>Cửa nhà bạn đang là cửa gì?</li><li>Kích thước khoảng bao nhiêu?</li><li>Cửa mở quay hay mở lùa?</li><li>Bạn sử dụng cửa thường xuyên hay ít?</li><li>Có cần thu gọn khi không sử dụng không?</li><li>Bạn ưu tiên thẩm mỹ, tiện dụng hay tiết kiệm chi phí?</li><li>Có cần giải pháp cho cửa lớn hoặc nhiều cánh không?</li></ul><p class="text-gray-900 font-bold text-base md:text-lg mt-4">Từ đó mới tư vấn loại cửa lưới phù hợp.</p><div class="not-prose text-left mt-8 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-50/80 p-6 md:p-8 rounded-2xl border border-sky-200 shadow-sm"><div><p class="text-lg md:text-xl font-extrabold text-primary uppercase">GỬI HÌNH CỬA – ĐỂ ĐƯỢC TƯ VẤN LOẠI CỬA LƯỚI PHÙ HỢP</p><p class="text-sm md:text-base text-gray-600 font-medium mt-1">Chụp hình cửa nhà bạn gửi qua Zalo để nhân viên kỹ thuật đo đạc và tư vấn nhanh nhất</p></div><a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white !text-white font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition text-base shrink-0 no-underline whitespace-nowrap"><span>📷</span> GỬI ẢNH CỬA QUA ZALO</a></div>`,
        serviceAreas
      };
    } else if (s.includes('rem')) {
      return {
        heroHeading: 'RÈM CỬA ĐÀ NẴNG – TƯ VẤN, ĐO ĐẠC & THI CÔNG TẬN NƠI',
        heroTypes: 'Rèm vải • Rèm cuốn • Rèm cầu vồng • Rèm sáo • Rèm lá dọc • Rèm tổ ong • Rèm tự động',
        heroSubtitle: 'Mang đến giải pháp rèm cửa phù hợp với không gian, ánh sáng, phong cách nội thất và nhu cầu sử dụng của từng gia đình, căn hộ, biệt thự, văn phòng tại Đà Nẵng.',
        heroCommitments: [
          'Khảo sát tận nơi',
          'Tư vấn theo thực tế',
          'Đo đạc chính xác',
          'Báo giá rõ ràng',
          'Thi công hoàn thiện'
        ],
        heroImage: 'https://gmuawrhowmcmhhpzxror.supabase.co/storage/v1/object/public/product-images/products/1788301747733-px424cjbry.jpg',
        heroIcons: [ { icon: ShieldCheck, text: "Cản sáng<br/>tuyệt đối" }, { icon: Box, text: "Cách nhiệt<br/>chống nóng" }, { icon: PenTool, text: "Kho mẫu<br/>đa dạng" }, { icon: Ruler, text: "Bảo hành<br/>trọn đời" } ],
        benefits: [
          { title: "Cản nắng 100% & Cách nhiệt chống nóng", desc: "Giảm nhiệt độ phòng tới 5 độ C, ngăn tia UV gây hại, giúp tiết kiệm tối đa chi phí điện năng cho điều hòa." },
          { title: "Nâng tầm đẳng cấp kiến trúc", desc: "Mẫu mã đa dạng từ Rèm vải buông, Rèm cầu vồng, Rèm cuốn... mang lại vẻ đẹp tinh tế, sang trọng cho mọi không gian." },
          { title: "Chất liệu thân thiện, an toàn sức khỏe", desc: "Vải dệt công nghệ cao, kháng khuẩn, chống bám bụi, đặc biệt an toàn cho hệ hô hấp của người già và trẻ nhỏ." },
          { title: "Vận hành êm ái - Phụ kiện đồng bộ", desc: "Sử dụng thanh treo và hệ bi lăn cao cấp siêu mượt. Hỗ trợ nâng cấp động cơ tự động thông minh tiện lợi." }
        ],
        faqs: [
          { q: 'Tôi nên chọn rèm vải hay rèm sáo?', a: 'Rèm vải phù hợp cho phòng ngủ, phòng khách cần sự mềm mại, cản sáng tốt. Rèm sáo/rèm cuốn phù hợp cho văn phòng, không gian hiện đại, cần gọn gàng.' },
          { q: 'Rèm có dễ bám bụi không?', a: 'Vải rèm cao cấp của chúng tôi được dệt dày đặc và phủ lớp chống bám bụi, rất ít bám bụi so với các loại vải thông thường.' },
          { q: 'Thời gian đặt may rèm mất bao lâu?', a: 'Thông thường từ lúc chốt mẫu đến khi lắp đặt hoàn thiện chỉ mất từ 2-4 ngày làm việc.' },
          { q: 'Bên mình có đo đạc tại nhà không?', a: 'Có, nhân viên sẽ mang catalogue mẫu vải đến tận nhà để đo đạc và tư vấn hoàn toàn miễn phí.' }
        ],
        pricingTable: [ { item: 'Rèm cuốn trơn / in tranh', price: '300.000đ', unit: 'm2' }, { item: 'Rèm cầu vồng Hàn Quốc', price: '420.000đ', unit: 'm2' }, { item: 'Rèm lá dọc', price: '200.000đ', unit: 'm ngang' }, { item: 'Rèm vải 2 lớp (Voan + Cản sáng)', price: '950.000đ - 1.500.000đ', unit: 'm ngang' } ],
        projects: [ { title: "Rèm vải 2 lớp", loc: "Hải Châu, Đà Nẵng", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Rèm sáo gỗ", loc: "Sơn Trà, Đà Nẵng", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" }, { title: "Rèm cầu vồng", loc: "Cẩm Lệ, Đà Nẵng", img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=400&q=80" }, { title: "Rèm cuốn văn phòng", loc: "Thanh Khê, Đà Nẵng", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80" } ],
        seoArticle: `<h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-5 uppercase tracking-tight">RÈM CỬA ĐÀ NẴNG – CHỌN ĐÚNG RÈM CHO ĐÚNG KHÔNG GIAN</h2><p class="text-gray-700 mb-4 leading-relaxed font-medium text-base">Mỗi cửa sổ và mỗi không gian có một nhu cầu khác nhau.</p><p class="text-gray-700 mb-5 leading-relaxed font-medium text-base">Phòng khách thường cần sự sang trọng và khả năng điều chỉnh ánh sáng. Phòng ngủ ưu tiên sự riêng tư và cản sáng. Căn hộ hiện đại lại cần thiết kế gọn gàng, trong khi cửa kính lớn có thể cần giải pháp rèm có kích thước và cơ chế vận hành phù hợp.</p><p class="text-gray-800 font-bold mb-3 text-base">Vì vậy, thay vì chọn rèm chỉ dựa vào màu sắc, Nội Thất Không Giới Hạn tư vấn dựa trên:</p><ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2 font-medium text-base"><li>Kích thước và kiểu cửa</li><li>Hướng nắng và lượng ánh sáng</li><li>Mục đích sử dụng</li><li>Phong cách nội thất</li><li>Mức độ riêng tư cần thiết</li><li>Khả năng cản sáng, cách nhiệt</li><li>Ngân sách đầu tư</li><li>Nhu cầu sử dụng rèm tự động</li></ul><div class="not-prose text-left mt-8 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-50/80 p-6 md:p-8 rounded-2xl border border-sky-200 shadow-sm"><div><p class="text-lg md:text-xl font-extrabold text-primary uppercase">GỬI HÌNH CỬA – ĐỂ ĐƯỢC TƯ VẤN LOẠI RÈM PHÙ HỢP</p><p class="text-sm md:text-base text-gray-600 font-medium mt-1">Chụp hình cửa nhà bạn gửi qua Zalo để nhận tư vấn mẫu phù hợp và báo giá nhanh nhất</p></div><a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white !text-white font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition text-base shrink-0 no-underline whitespace-nowrap"><span>📷</span> GỬI ẢNH CỬA QUA ZALO</a></div>`,
        serviceAreas
      };
    } else if (s.includes('tam-op') || s.includes('nhua-op')) {
      return {
        heroSubtitle: "Giải pháp vàng khắc phục triệt để tình trạng <strong>tường ẩm mốc, bong tróc</strong>. Thi công <strong>tấm ốp tường Nano/PVC</strong> siêu tốc không bụi bẩn. Đẹp sang trọng, bền bỉ 20 năm!",
        heroIcons: [ { icon: ShieldCheck, text: "Chống ẩm mốc<br/>100%" }, { icon: Box, text: "Ốp trực tiếp<br/>tường cũ" }, { icon: PenTool, text: "Không mùi<br/>độc hại" }, { icon: Ruler, text: "Độ bền<br/>trên 20 năm" } ],
        benefits: [
          { title: "Khắc phục triệt để tường mốc, thấm dột", desc: "Cốt nhựa nguyên sinh chống nước 100%, ngăn ngừa nấm mốc sinh sôi, là vị cứu tinh cho bức tường cũ ẩm thấp." },
          { title: "Thi công siêu tốc - Không bụi bẩn", desc: "Lắp đặt trực tiếp lên bề mặt tường thô hoặc tường cũ bằng hệ ngàm thông minh. Xong ngay trong ngày, ở được liền!" },
          { title: "Vẻ đẹp chân thực như Gỗ & Đá tự nhiên", desc: "Công nghệ in 3D phủ màng UV bảo vệ giúp vân gỗ, vân đá sắc nét, mang lại sự sang trọng không kém vật liệu tự nhiên." },
          { title: "Cách âm, cách nhiệt, siêu bền bỉ", desc: "Cấu trúc lỗ rỗng giúp tiêu âm, cách nhiệt hiệu quả. Chống cháy lan, không mối mọt, tuổi thọ lên đến hơn 30 năm." }
        ],
        faqs: [
          { q: 'Tường chưa tô (trát) có ốp được không?', a: 'Hoàn toàn được. Chúng tôi sử dụng hệ khung xương kiên cố để bắt tấm ốp, không cần tường phải phẳng hay đã tô trát.' },
          { q: 'Tấm ốp bằng nhựa có độc hại không?', a: 'Tấm ốp Nano được làm từ nhựa nguyên sinh và bột đá, hoàn toàn không chứa formandehyde hay các hóa chất gây hại, rất an toàn.' },
          { q: 'Tấm ốp có bị mối mọt không?', a: 'Sản phẩm chống thấm nước 100% và kháng mối mọt tuyệt đối, độ bền lên đến 20-30 năm.' },
          { q: 'Có dễ bị bắt lửa không?', a: 'Tấm ốp cao cấp có khả năng chống cháy lan, khi gặp lửa chỉ co lại chứ không bùng phát thành ngọn lửa lớn.' }
        ],
        pricingTable: [ { item: 'Tấm ốp tường nhựa Nano phẳng', price: '350.000đ - 450.000đ', unit: 'm2' }, { item: 'Tấm ốp nhựa PVC vân đá / tráng gương', price: '450.000đ - 550.000đ', unit: 'm2' }, { item: 'Tấm ốp lam sóng giả gỗ', price: '400.000đ - 650.000đ', unit: 'm2' }, { item: 'Phào chỉ nhựa Hàn Quốc', price: '60.000đ - 120.000đ', unit: 'md' } ],
        projects: [ { title: "Ốp vách Tivi vân đá", loc: "Ngũ Hành Sơn, Đà Nẵng", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Ốp phòng ngủ lam sóng", loc: "Cẩm Lệ, Đà Nẵng", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=400&q=80" }, { title: "Cải tạo tường mốc", loc: "Hải Châu, Đà Nẵng", img: "https://images.unsplash.com/photo-1599427301072-50d4f3b25d05?auto=format&fit=crop&w=400&q=80" }, { title: "Trang trí sảnh lễ tân", loc: "Hội An, Quảng Nam", img: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&w=400&q=80" } ],
        seoArticle: `<h2 class="text-2xl font-bold text-gray-900 mb-4 uppercase">Thi Công Tấm Ốp Tường Nhựa PVC, Nano Chuyên Nghiệp Tại Đà Nẵng</h2><p class="text-gray-700 mb-4 leading-relaxed font-medium">Những bức tường cũ bị thấm dột, nấm mốc bong tróc sơn mảng lớn đang làm mất đi vẻ thẩm mỹ của ngôi nhà bạn? Sơn lại tường không giải quyết được gốc rễ vấn đề, mùi sơn độc hại và bụi bẩn khi cạo lớp sơn cũ làm bạn ngần ngại? <strong>Tấm ốp tường nhựa Nano/PVC</strong> chính là giải pháp hoàn hảo nhất hiện nay!</p><p class="text-gray-700 mb-4 leading-relaxed font-medium">Được sản xuất từ bột đá tự nhiên kết hợp nhựa nguyên sinh PVC, tấm ốp tường sở hữu khả năng chống nước 100%, không mối mọt, không cong vênh. Đặc biệt, bề mặt được phủ màng film vân đá, vân gỗ sắc nét kết hợp lớp bảo vệ UV, giúp không gian nội thất trở nên sang trọng lộng lẫy.</p><h3 class="text-xl font-bold text-gray-900 mb-3 mt-6">Ưu điểm khi chọn Nội Thất Không Giới Hạn</h3><ul class="list-disc pl-5 text-gray-700 mb-4 space-y-2 font-medium"><li><strong>Khảo sát và xử lý chuẩn kỹ thuật:</strong> Đối với tường ẩm mốc nặng, thợ kỹ thuật của chúng tôi sẽ đóng hệ khung xương kẽm hoặc sắt cách tường để ốp tấm, đảm bảo tường được thở và tấm ốp không bao giờ bị rớt.</li><li><strong>Thi công nhanh, sạch sẽ:</strong> Không đập phá, không bụi bẩn. Gia đình hoàn toàn có thể sinh hoạt bình thường trong quá trình thi công. Dọn ở ngay trong ngày.</li><li><strong>Giá thành cạnh tranh:</strong> Nhập hàng trực tiếp từ nhà máy không qua trung gian, mang đến mức giá tốt nhất cho khách hàng Đà Nẵng.</li></ul>`,
        serviceAreas
      };
    } else if (s.includes('giay-dan') || s.includes('tranh-dan')) {
      return {
        heroSubtitle: "Thổi hồn vào không gian với hàng ngàn mẫu <strong>giấy dán tường Hàn Quốc & tranh 3D</strong> sắc nét. <strong>Thi công nhanh trong ngày, không mùi độc hại</strong>. Giá tận kho cực sốc!",
        heroIcons: [ { icon: ShieldCheck, text: "Đa dạng<br/>phong cách" }, { icon: Box, text: "Che khuyết điểm<br/>tường" }, { icon: PenTool, text: "Mực in<br/>an toàn" }, { icon: Ruler, text: "Thi công<br/>không mùi" } ],
        benefits: [
          { title: "Biến hóa không gian theo mọi phong cách", desc: "Từ hiện đại, tối giản đến cổ điển Châu Âu hay ngộ nghĩnh cho phòng bé. Kho mẫu 10.000+ thiết kế cập nhật liên tục." },
          { title: "Bề mặt chống xước, dễ dàng lau chùi", desc: "Lớp phủ Vinyl cao cấp chống thấm nước bề mặt, chống bám bụi, chỉ cần dùng khăn ẩm lau nhẹ là sạch như mới." },
          { title: "An toàn tuyệt đối - Mực in sinh thái", desc: "Sử dụng mực in Eco-Solvent không mùi hóa chất, thi công xong có thể sinh hoạt ngay, cực kỳ an toàn cho sức khỏe." },
          { title: "Thi công chuyên nghiệp, nhanh gọn", desc: "Keo dán chuyên dụng kết hợp tay nghề thợ lâu năm giúp mép nối hoàn hảo, không bong tróc, sạch sẽ trong vài giờ." }
        ],
        faqs: [
          { q: 'Tường bị mốc, thấm có dán giấy được không?', a: 'Không nên. Giấy dán tường chỉ phù hợp với tường khô ráo. Nếu tường thấm mốc, bạn nên chuyển sang giải pháp Tấm ốp tường Nano.' },
          { q: 'Khi lột bỏ giấy cũ có làm hỏng lớp sơn tường không?', a: 'Nếu thi công đúng kỹ thuật, khi lột bỏ giấy sẽ không làm hỏng lớp trát tường, nhưng có thể ảnh hưởng một phần đến lớp sơn cũ.' },
          { q: 'Tuổi thọ của giấy dán tường là bao lâu?', a: 'Giấy dán tường Hàn Quốc cao cấp có tuổi thọ từ 5 - 10 năm tùy thuộc vào điều kiện độ ẩm của môi trường.' },
          { q: 'Dán 1 phòng ngủ mất bao lâu?', a: 'Thời gian thi công rất nhanh, 1 thợ lành nghề có thể hoàn thiện 1 phòng ngủ tiêu chuẩn trong vòng 2-3 tiếng.' }
        ],
        pricingTable: [ { item: 'Giấy dán tường Hàn Quốc (trơn, vân đơn giản)', price: '65.000đ - 85.000đ', unit: 'm2' }, { item: 'Giấy dán tường Tân Cổ Điển cao cấp', price: '90.000đ - 120.000đ', unit: 'm2' }, { item: 'Tranh dán tường 3D lụa mực dầu', price: '150.000đ', unit: 'm2' }, { item: 'Tranh dán tường 3D UV phủ bóng', price: '150.000đ', unit: 'm2' } ],
        projects: [ { title: "Giấy dán tường phòng ngủ", loc: "Sơn Trà, Đà Nẵng", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Tranh dán tường 3D phòng khách", loc: "Cẩm Lệ, Đà Nẵng", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" }, { title: "Giấy dán tường phòng em bé", loc: "Hải Châu, Đà Nẵng", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" }, { title: "Tranh phong cảnh Spa", loc: "Hội An, Quảng Nam", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80" } ],
        seoArticle: `<h2 class="text-2xl font-bold text-gray-900 mb-4 uppercase">Phân Phối & Thi Công Giấy Dán Tường Hàn Quốc, Tranh 3D Tại Đà Nẵng</h2><p class="text-gray-700 mb-4 leading-relaxed font-medium">Thay vì tốn thời gian dọn dẹp và chịu đựng mùi sơn nồng nặc trong nhiều ngày, hàng ngàn khách hàng tại Đà Nẵng đã lựa chọn <strong>giấy dán tường Hàn Quốc</strong> để F5 lại không gian sống. Điểm mạnh lớn nhất của giấy dán tường là tốc độ thi công cực nhanh, mẫu mã vô cùng phong phú và hoàn toàn thân thiện với sức khỏe.</p><p class="text-gray-700 mb-4 leading-relaxed font-medium">Tại kho <strong>Nội Thất Không Giới Hạn</strong>, chúng tôi luôn cập nhật những quyển catalogue mới nhất trực tiếp từ Hàn Quốc (như dòng Natural, Albany, X-Treme...). Bề mặt giấy được phủ lớp Vinyl bảo vệ dai chắc, lau chùi dễ dàng, không thấm nước mặt ngoài.</p><h3 class="text-xl font-bold text-gray-900 mb-3 mt-6">Kỹ thuật thi công tranh giấy dán tường điểm 10</h3><ul class="list-disc pl-5 text-gray-700 mb-4 space-y-2 font-medium"><li><strong>Xử lý mặt bằng kỹ lưỡng:</strong> Trước khi dán, thợ sẽ tiến hành mài cạo các cục sạn, bột matit thừa trên tường để đảm bảo bề mặt phẳng mịn nhất.</li><li><strong>Keo dán chuyên dụng:</strong> Sử dụng tỷ lệ pha trộn hoàn hảo giữa keo bột (chống mốc) và keo sữa (tăng độ bám dính mí giấy), giúp giấy bám chắc vào tường đến hơn 7 năm.</li><li><strong>Ghép mí nghệ thuật:</strong> Kỹ thuật vuốt keo và ghép mí chuẩn xác giúp các mép nối hòa làm một, hoa văn liền mạch tinh tế.</li></ul><p class="text-gray-700 leading-relaxed font-medium">Liên hệ ngay để nhân viên xách Catalogue tới tận nhà tư vấn miễn phí!</p>`,
        serviceAreas
      };
    }
    
    return {
      heroSubtitle: "Giải pháp <strong>trang trí tường hiện đại</strong> – <strong>đa dạng mẫu mã</strong> – <strong>thi công chuyên nghiệp</strong> mang đến không gian sống sang trọng, tinh tế và đầy cảm hứng.",
      heroIcons: [ { icon: Box, text: "Hơn 10.000 mẫu<br/>đa dạng" }, { icon: PenTool, text: "Tư vấn - thiết kế<br/>miễn phí" }, { icon: Ruler, text: "Đo đạc tận nơi<br/>chuyên nghiệp" }, { icon: ShieldCheck, text: "Bảo hành<br/>lên đến 5 năm" } ],
      benefits: [ { title: "Mẫu mã đa dạng", desc: "Hơn 10.000 mẫu mã, liên tục cập nhật." } ],
      faqs: [],
      pricingTable: [],
      projects: [],
      seoArticle: '',
      serviceAreas
    };
  };

  
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const sort = resolvedParams.sort || 'default';
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const ITEMS_PER_PAGE = 8;
  
  function formatCategoryName(s: string) {
    const baseSlug = s.replace(/-da-nang$/, '');
    const map: Record<string, string> = {
      'tam-op-tuong-tran': 'Tấm Ốp Tường Trần',
      'tam-op-tuong-nano': 'Tấm Ốp Tường Nano',
      'rem-cua': 'Rèm Cửa',
      'giay-dan-tuong': 'Giấy Dán Tường',
      'tranh-dan-tuong': 'Tranh Dán Tường',
      'cua-luoi-chong-muoi': 'Cửa Lưới Chống Muỗi',
      'cua-luoi-chong-muoi-co-dinh': 'Cửa Lưới Chống Muỗi Cố Định',
      'cua-luoi-chong-muoi-dang-xep': 'Cửa Lưới Chống Muỗi Dạng Xếp',
      'cua-luoi-chong-muoi-ket-hop-rem': 'Cửa Lưới Chống Muỗi Kết Hợp Rèm',
      'cua-luoi-chong-muoi-khong-ray': 'Cửa Lưới Chống Muỗi Không Ray',
      'cua-luoi-chong-muoi-mo-lua': 'Cửa Lưới Chống Muỗi Mở Lùa',
      'cua-luoi-chong-muoi-tu-cuon': 'Cửa Lưới Chống Muỗi Tự Cuốn',
      'rem-sao': 'Rèm Sáo',
      'rem-vai': 'Rèm Vải',
      'rem-cuon': 'Rèm Cuốn',
      'rem-la-doc': 'Rèm Lá Dọc',
      'rem-cau-vong': 'Rèm Cầu Vồng'
    };
    if (map[baseSlug]) return map[baseSlug];
    if (map[s]) return map[s];
    const decodedSlug = decodeURIComponent(s).replace(/-/g, ' ');
    return decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
  }

  const title = formatCategoryName(slug);

  const supabase = getPublicClient();

  // Find Category or Subcategory by slug
  let { data: categoryList } = await supabase
    .from('categories')
    .select('id, name, slug')
    .or(`slug.eq.${slug},slug.eq.${slug}-da-nang`);
    
  let category = categoryList?.[0];

  let categoryId = category?.id;
  let isSubCategory = false;
  let categoryName = category?.name || title;
  let parentCategory: { name: string, slug: string } | null = null;

  if (!category) {
    const { data: subCategoryList } = await supabase
      .from('sub_categories')
      .select('id, name, slug, category_id, categories(name, slug)')
      .or(`slug.eq.${slug},slug.eq.${slug}-da-nang`);
      
    const subCategory = subCategoryList?.[0];
    
    if (subCategory) {
      categoryId = subCategory.id;
      isSubCategory = true;
      categoryName = subCategory.name || formatCategoryName(subCategory.slug || slug);
      parentCategory = subCategory.categories as any;
      if (parentCategory) {
         parentCategory.name = parentCategory.name || formatCategoryName(parentCategory.slug);
      }
    }
  }


  // Fetch products
  let products: any[] = [];
  if (categoryId) {
    const query = supabase.from('products').select('*');
    if (isSubCategory) {
      query.eq('sub_category_id', categoryId);
    } else {
      query.eq('category_id', categoryId);
    }
    const { data } = await query;
    if (data) {
      // Tự động nhân bản sản phẩm dựa trên số lượng ảnh trong gallery_images
      let expandedProducts: any[] = [];
      const seenImageNames = new Set<string>();
      
      // Hàm trích xuất tên file từ URL để so sánh (bỏ qua khác biệt về đường dẫn thư mục và hậu tố kích thước ảnh ví dụ -600x600)
      const getFileName = (url: string) => {
        if (!url) return '';
        let name = url.split('/').pop()?.split('?')[0] || '';
        // Loại bỏ các hậu tố kích thước ảnh do WordPress tự sinh ra (VD: -600x600, -247x296) trước phần mở rộng
        name = name.replace(/-\d+x\d+(?=\.[a-zA-Z0-9]+$)/, '');
        return name;
      };

      data.forEach((prod) => {
        if (prod.image_url) {
          seenImageNames.add(getFileName(prod.image_url));
        }
        
        // Luôn hiển thị sản phẩm với ảnh chính (image_url)
        expandedProducts.push(prod);
        
        // Nếu có ảnh trong gallery_images, tạo thêm mỗi ảnh một card với nội dung giữ nguyên
        if (prod.gallery_images && Array.isArray(prod.gallery_images) && prod.gallery_images.length > 0) {
          prod.gallery_images.forEach((img: string, idx: number) => {
            const fileName = getFileName(img);
            // Chỉ thêm nếu tên file ảnh chưa từng xuất hiện (áp dụng cho toàn bộ danh mục để chống lặp chéo)
            if (!seenImageNames.has(fileName)) {
              seenImageNames.add(fileName);
              expandedProducts.push({
                ...prod,
                id: `${prod.id}-gallery-${idx}`,
                image_url: img
              });
            }
          });
        }
      });
      
      products = expandedProducts;

      // Áp dụng thuật toán Sắp xếp (Sort)
      if (sort === 'price-asc') {
        products.sort((a, b) => parsePrice(a.sale_price || a.original_price) - parsePrice(b.sale_price || b.original_price));
      } else if (sort === 'price-desc') {
        products.sort((a, b) => parsePrice(b.sale_price || b.original_price) - parsePrice(a.sale_price || a.original_price));
      } else if (sort === 'latest') {
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }
  }

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Fetch sub-categories if it's a main category
  let subCategoriesList: any[] = [];
  if (!isSubCategory && categoryId) {
    const { data: subCats } = await supabase
      .from('sub_categories')
      .select('id, name, slug, image_url, description')
      .eq('category_id', categoryId);
      
    if (subCats) {
      // Chỉ tìm ảnh sản phẩm bổ sung nếu sub_category chưa có image_url (batch 1 query duy nhất thay vì N+1 loop)
      const missingImageSubs = subCats.filter(s => !s.image_url);
      if (missingImageSubs.length > 0) {
        const { data: fallbackProds } = await supabase
          .from('products')
          .select('sub_category_id, image_url')
          .in('sub_category_id', missingImageSubs.map(s => s.id))
          .not('image_url', 'is', null);

        if (fallbackProds && fallbackProds.length > 0) {
          const imgMap = new Map<string, string>();
          for (const prod of fallbackProds) {
            if (prod.sub_category_id && !imgMap.has(prod.sub_category_id) && prod.image_url) {
              imgMap.set(prod.sub_category_id, prod.image_url);
            }
          }
          subCats.forEach(s => {
            if (!s.image_url && imgMap.has(s.id)) {
              s.image_url = imgMap.get(s.id);
            }
          });
        }
      }
      subCategoriesList = subCats;
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1) ||
        (i <= 3 && currentPage < 4) ||
        (i >= totalPages - 2 && currentPage > totalPages - 3)
      ) {
        pages.push(i);
      }
    }
    
    const uniquePages = Array.from(new Set(pages)).sort((a, b) => a - b);
    
    const paginationItems = [];
    let lastPage = 0;
    for (const p of uniquePages) {
      if (lastPage > 0 && p - lastPage > 1) {
        paginationItems.push('...');
      }
      paginationItems.push(p);
      lastPage = p;
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-12">
        {currentPage > 1 && (
          <Link href={`?sort=${sort}&page=${currentPage - 1}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-500 hover:bg-primary hover:text-white border border-gray-200 transition font-bold">
            {'‹'}
          </Link>
        )}
        
        {paginationItems.map((item, idx) => {
          if (item === '...') {
            return <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>;
          }
          return (
            <Link key={item} href={`?sort=${sort}&page=${item}`} className={`w-10 h-10 flex items-center justify-center rounded-full border transition font-medium ${item === currentPage ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
              {item}
            </Link>
          );
        })}

        {currentPage < totalPages && (
          <Link href={`?sort=${sort}&page=${currentPage + 1}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-500 hover:bg-primary hover:text-white border border-gray-200 transition font-bold">
            {'›'}
          </Link>
        )}
      </div>
    );
  };

  const parentContent = getParentCategoryContent(parentCategory?.slug || slug);

  const renderBreadcrumb = () => (
    <div className="w-full relative h-[300px] md:h-[400px] bg-gray-100">
      <Image 
        src={(parentContent as any)?.bannerImage || (parentContent as any)?.heroImage || "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1920&q=80"} 
        alt={categoryName} 
        fill 
        className="object-cover" 
        priority
      />
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="bg-black/70 text-white py-3 md:py-4 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center uppercase text-[11px] sm:text-sm max-w-full gap-y-1">
               <Link href="/" className="hover:text-secondary transition text-gray-300 shrink-0">TRANG CHỦ</Link>
               <span className="mx-2 text-gray-500 shrink-0">/</span>
               {parentCategory ? (
                 <>
                   <Link href={`/danh-muc/${parentCategory.slug}`} className="hover:text-secondary transition text-gray-300 shrink-0">{parentCategory.name}</Link>
                   <span className="mx-2 text-gray-500 shrink-0">/</span>
                   <span className="text-white font-bold shrink-0">{categoryName}</span>
                 </>
               ) : (
                 <span className="text-white font-bold shrink-0">{categoryName}</span>
               )}
            </div>
            
            <div className="shrink-0 hidden sm:block">
              <SortDropdown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to get dynamic features based on category
  const getCategoryFeatures = (catSlug: string) => {
    const s = catSlug.toLowerCase();
    if (s.includes('cua-luoi')) {
      return [
        { icon: ShieldCheck, text: "Ngăn muỗi<br/>hiệu quả" },
        { icon: Box, text: "Thoáng mát<br/>đón gió tự nhiên" },
        { icon: Award, text: "Bền đẹp<br/>với thời gian" },
        { icon: CheckCircle2, text: "Bảo hành<br/>lên đến 5 năm" }
      ];
    } else if (s.includes('rem')) {
      return [
        { icon: ShieldCheck, text: "Cản sáng<br/>cách nhiệt" },
        { icon: Box, text: "Thẩm mỹ<br/>sang trọng" },
        { icon: PenTool, text: "Dễ dàng<br/>vệ sinh" },
        { icon: CheckCircle2, text: "Bảo hành<br/>lên đến 2 năm" }
      ];
    } else if (s.includes('tam-op') || s.includes('nhua-op')) {
      return [
        { icon: ShieldCheck, text: "Chống ẩm mốc<br/>100%" },
        { icon: Box, text: "Thi công<br/>nhanh chóng" },
        { icon: Award, text: "Bền đẹp<br/>với thời gian" },
        { icon: CheckCircle2, text: "Bảo hành<br/>lên đến 5 năm" }
      ];
    } else if (s.includes('giay-dan') || s.includes('tranh-dan')) {
      return [
        { icon: Box, text: "Đa dạng<br/>mẫu mã" },
        { icon: PenTool, text: "Thi công nhanh<br/>trong ngày" },
        { icon: ShieldCheck, text: "Không mùi<br/>độc hại" },
        { icon: Award, text: "Độ bền<br/>cao" }
      ];
    }
    return [
      { icon: ShieldCheck, text: "Sản phẩm<br/>chính hãng" },
      { icon: Box, text: "Thi công<br/>chuyên nghiệp" },
      { icon: Award, text: "Bền đẹp<br/>với thời gian" },
      { icon: CheckCircle2, text: "Bảo hành<br/>dài hạn" }
    ];
  };

  const currentFeatures = getCategoryFeatures(parentCategory?.slug || slug);

  const getSubCategoryContent = (catSlug: string, catName: string, parentCatSlug?: string) => {
    const s = catSlug.toLowerCase();
    const parentS = (parentCatSlug || '').toLowerCase();
    
    // Default / Fallback structure
    let intro = [
      `<strong>${catName}</strong> là giải pháp tối ưu được thiết kế riêng biệt, mang lại sự tiện nghi và thẩm mỹ cao cho không gian của bạn.`,
      `Sản phẩm không chỉ đáp ứng công năng sử dụng hoàn hảo mà còn là điểm nhấn kiến trúc, bảo vệ môi trường sống luôn an toàn và thông thoáng.`
    ];
    let applications = ['Cửa sổ phòng ngủ', 'Cửa đi chính', 'Cửa ban công', 'Cửa thông phòng'];
    let components = [
      { title: 'Vật liệu khung', desc: 'Sơn tĩnh điện cao cấp, chống gỉ sét, độ bền lên tới 20 năm.' },
      { title: 'Vật liệu bề mặt', desc: 'Chất liệu nhập khẩu, chống chịu thời tiết khắc nghiệt.' },
      { title: 'Hệ phụ kiện', desc: 'Đồng bộ cao cấp, đảm bảo độ bền và thẩm mỹ.' },
      { title: 'Cơ chế vận hành', desc: 'Thiết kế thông minh giúp sử dụng trơn tru, dễ dàng.' }
    ];
    let fallbackImage1 = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    let fallbackImage2 = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80';
    let heroSubtitle = '';
    let benefits: { title: string, desc: string }[] = [];

    if (s.includes('cua-luoi') || parentS.includes('cua-luoi')) {
      fallbackImage1 = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80';
      fallbackImage2 = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80';
      if (s.includes('co-dinh')) {
        heroSubtitle = `Bảo vệ an toàn tuyệt đối với <strong>${catName}</strong>. Khung nhôm chắc chắn, lưới siêu bền ngăn chặn 100% côn trùng mà vẫn thông thoáng.`;
        benefits = [
          { title: "Chống muỗi toàn diện", desc: "Lưới đan dày ngăn chặn ngay cả những côn trùng nhỏ nhất." },
          { title: "Chi phí tiết kiệm", desc: "Giải pháp hiệu quả với chi phí thi công tối ưu nhất." },
          { title: "Lấy sáng và đón gió", desc: "Không làm cản trở tầm nhìn hay luồng không khí tự nhiên." },
          { title: "Tuổi thọ cao", desc: "Sử dụng vật liệu chống gỉ sét, chịu được thời tiết khắc nghiệt." }
        ];
        intro = [
          `<strong>${catName}</strong> là hệ thống lưới được lắp cố định vào khung cửa, không thiết kế để đóng mở thường xuyên.`,
          `Sản phẩm giúp tạo lớp chắn bảo vệ không gian bên trong, ngăn muỗi và côn trùng xâm nhập mà vẫn đảm bảo ánh sáng và luồng gió tự nhiên.`
        ];
        applications = ['Cửa sổ ít mở', 'Ô thoáng, giếng trời', 'Khung bảo vệ cửa', 'Lỗ thông gió'];
        components = [
          { title: 'Khung nhôm định hình', desc: 'Bản nhôm chắc chắn, phủ sơn tĩnh điện chống xước.' },
          { title: 'Lưới inox/sợi thủy tinh', desc: 'Đan mắt siêu nhỏ, ngăn 100% muỗi và côn trùng.' },
          { title: 'Ke góc nhựa/nhôm', desc: 'Liên kết các góc khung vuông vắn, cứng cáp.' },
          { title: 'Vật tư cố định', desc: 'Ốc vít inox, nở nhựa chuyên dụng đóng thẳng vào tường.' }
        ];
      } else if (s.includes('khong-ray')) {
        heroSubtitle = `Trải nghiệm tiện nghi với <strong>${catName}</strong> cao cấp. An toàn cho trẻ nhỏ và người già, thiết kế sang trọng tàng hình.`;
        benefits = [
          { title: "An toàn tuyệt đối", desc: "Không có thanh ray cồng kềnh dưới nền, chống vấp ngã." },
          { title: "Thiết kế tàng hình", desc: "Lưới xếp gọn gàng khi không sử dụng, tiết kiệm diện tích." },
          { title: "Thẩm mỹ cao cấp", desc: "Phù hợp với các biệt thự, nhà phố sang trọng." },
          { title: "Vận hành siêu nhẹ", desc: "Kéo mở trơn tru chỉ với một ngón tay." }
        ];
        intro = [
          `<strong>${catName}</strong> là dòng cửa cao cấp nhất, thiết kế đặc biệt không có thanh ray dưới nền, chống vấp ngã an toàn tuyệt đối.`,
          `Lưới được xếp lại gọn gàng khi không sử dụng, vừa tiết kiệm không gian vừa giữ nguyên vẻ sang trọng vốn có của ngôi nhà.`
        ];
        applications = ['Cửa đi chính', 'Cửa ban công', 'Cửa thông phòng rộng', 'Nhà có trẻ nhỏ, người già'];
        components = [
          { title: 'Khung nhôm định hình', desc: 'Thiết kế bo tròn thẩm mỹ, chịu lực vặn xoắn tốt.' },
          { title: 'Lưới xếp sợi thủy tinh', desc: 'Gấp nếp tinh tế, phủ nhựa uPVC siêu bền chống rách.' },
          { title: 'Hệ thống kéo đẩy', desc: 'Sử dụng hệ dây dù Kevlar và con lăn định hướng mượt mà.' },
          { title: 'Xích nhựa chạy dưới', desc: 'Ẩn xích khi kéo, thay thế hoàn toàn thanh ray cồng kềnh.' }
        ];
      } else if (s.includes('dang-xep')) {
        heroSubtitle = `Giải pháp <strong>${catName}</strong> linh hoạt, tiết kiệm không gian. Lưới xếp gọn hình cánh quạt thẩm mỹ, lắp đặt cho mọi hệ cửa.`;
        benefits = [
          { title: "Linh hoạt đóng mở", desc: "Dễ dàng thu gọn lưới sang 1 hoặc 2 bên khi không dùng." },
          { title: "Lắp đặt mọi vị trí", desc: "Tương thích với hầu hết các hệ cửa nhựa, cửa nhôm, cửa gỗ." },
          { title: "Chống muỗi 100%", desc: "Lưới sợi thủy tinh phủ nhựa siêu bền, không kẽ hở." },
          { title: "Vệ sinh dễ dàng", desc: "Tháo lắp đơn giản để vệ sinh lưới nhanh chóng." }
        ];
        intro = [
          `<strong>${catName}</strong> hoạt động theo nguyên lý xếp hình cánh quạt, lưới có thể thu gọn lại khi không dùng đến rất tiện lợi.`,
          `Đây là giải pháp linh hoạt và phổ biến nhất, phù hợp lắp đặt cho nhiều kích thước cửa khác nhau mà không làm mất diện tích.`
        ];
        applications = ['Cửa đi 2-4 cánh', 'Cửa sổ lùa', 'Cửa ra ban công', 'Cửa sổ kích thước lớn'];
        components = [
          { title: 'Khung nhôm định hình', desc: 'Sơn tĩnh điện nhiều màu sắc (Trắng, Xingfa, Vân gỗ...)' },
          { title: 'Lưới xếp gấp nếp', desc: 'Sợi thủy tinh cao cấp, chống cháy lan, chống tia UV.' },
          { title: 'Hệ ray trượt', desc: 'Ray dẫn hướng nhôm êm ái, thiết kế rãnh thoát nước.' },
          { title: 'Dây dẫn hướng', desc: 'Dây dù đan chéo giúp lưới xếp mở cân bằng, không bị xô.' }
        ];
      } else if (s.includes('mo-lua')) {
        heroSubtitle = `Vận hành mượt mà, siêu bền bỉ với <strong>${catName}</strong>. Chịu lực tốt, chống chuột và thú cưng cào rách hoàn hảo.`;
        benefits = [
          { title: "Chịu lực tuyệt vời", desc: "Lưới inox cứng cáp chống lại lực cào của chó mèo, chuột cắn." },
          { title: "Chịu gió bão", desc: "Hệ khung nhôm chắc chắn, không bị bung lưới khi có gió lớn." },
          { title: "Vận hành êm ái", desc: "Trượt mượt mà trên bánh xe, không gây tiếng ồn." },
          { title: "Sang trọng và bền bỉ", desc: "Tuổi thọ lên đến 20 năm, không lo rỉ sét." }
        ];
        intro = [
          `<strong>${catName}</strong> được thiết kế dạng cánh trượt trên thanh ray, vận hành mượt mà như cửa nhôm kính thông thường.`,
          `Sản phẩm cực kỳ bền bỉ, thích hợp cho các khu vực có diện tích rộng và thường xuyên hứng chịu gió mạnh.`
        ];
        applications = ['Cửa sổ lùa', 'Cửa ban công trượt', 'Cửa sau nhà', 'Khu vực đón gió mạnh'];
        components = [
          { title: 'Khung cánh lùa', desc: 'Bản nhôm dày dặn, có rãnh lắp gioăng lông chống ồn.' },
          { title: 'Lưới inox 316', desc: 'Chống rỉ sét, chịu lực va đập cực tốt, không sợ chuột cắn.' },
          { title: 'Hệ thống bánh xe', desc: 'Bánh xe Inox/nhựa trượt êm ái trên ray định hướng.' },
          { title: 'Ray nhôm trượt', desc: 'Gồm ray trên dẫn hướng và ray dưới đỡ trọng lực cánh.' }
        ];
      } else if (s.includes('tu-cuon') || s.includes('cuon')) {
        heroSubtitle = `Cuốn thả nhẹ nhàng, thiết kế thông minh với <strong>${catName}</strong>. Tự động cuộn lưới vào hộp gọn gàng khi không dùng tới.`;
        benefits = [
          { title: "Thiết kế thông minh", desc: "Trục cuốn tự động thu lưới vào hộp cực kỳ gọn gàng." },
          { title: "Thẩm mỹ cao", desc: "Không làm thay đổi cấu trúc và vẻ đẹp của cửa sổ có sẵn." },
          { title: "Vận hành êm ái", desc: "Hệ thống lò xo đàn hồi giúp kéo thả nhẹ nhàng." },
          { title: "Vệ sinh dễ dàng", desc: "Khung nhôm hộp dễ lau chùi, chống bám bụi bẩn." }
        ];
        intro = [
          `<strong>${catName}</strong> là hệ thống cửa lưới thông minh, có cấu tạo gồm trục cuốn và lò xo tự động thu lưới khi không sử dụng.`,
          `Giải pháp này cực kỳ gọn gàng, mang tính thẩm mỹ cao và rất được ưa chuộng lắp đặt cho các hệ cửa sổ nhỏ.`
        ];
        applications = ['Cửa sổ phòng ngủ', 'Cửa sổ nhà vệ sinh', 'Cửa sổ bếp', 'Các ô thoáng hẹp'];
        components = [
          { title: 'Khung nhôm hộp cuốn', desc: 'Chứa trục cuốn và lò xo bên trong, sơn tĩnh điện đẹp mắt.' },
          { title: 'Lưới sợi thủy tinh', desc: 'Mềm dẻo, dễ dàng cuộn lại mà không gãy nếp.' },
          { title: 'Lò xo tự cuốn', desc: 'Làm bằng thép chuyên dụng, độ đàn hồi cực tốt.' },
          { title: 'Ray dẫn hướng', desc: 'Định hình đường chạy của lưới, tích hợp gioăng chống ồn.' }
        ];
      } else if (s.includes('ket-hop-rem') || s.includes('rem-ket-hop')) {
        heroSubtitle = `Giải pháp 2 trong 1 hoàn hảo với <strong>${catName}</strong>. Vừa ngăn muỗi 100%, vừa cản nắng, cách nhiệt cho không gian.`;
        benefits = [
          { title: "Giải pháp 2 trong 1", desc: "Tích hợp cả lưới chống muỗi và rèm tổ ong cản nắng." },
          { title: "Tiết kiệm chi phí", desc: "Thay vì mua 2 bộ riêng biệt, bạn chỉ cần 1 hệ khung duy nhất." },
          { title: "Cách nhiệt hiệu quả", desc: "Lớp rèm tráng bạc giúp cản nhiệt từ bên ngoài vào nhà." },
          { title: "Vận hành độc lập", desc: "Kéo lưới hoặc kéo rèm riêng biệt theo ý thích." }
        ];
        intro = [
          `<strong>${catName}</strong> là hệ cửa cải tiến mới nhất, tích hợp đồng thời chức năng chống muỗi và rèm tổ ong cản nắng trên cùng một hệ khung.`,
          `Đây là giải pháp vô cùng thông minh giúp tiết kiệm diện tích tối đa, mang lại tiện ích 2 trong 1 cho ngôi nhà hiện đại.`
        ];
        applications = ['Cửa sổ hướng Tây nắng gắt', 'Cửa đi phòng ngủ', 'Cửa ban công kính lớn', 'Phòng cần sự riêng tư'];
        components = [
          { title: 'Hệ khung chung', desc: 'Nhôm xingfa bản to, chắc chắn, ray trượt êm ái.' },
          { title: 'Lớp lưới chống muỗi', desc: 'Lưới sợi thủy tinh/nhựa Polyester dạng xếp gấp nếp.' },
          { title: 'Lớp rèm tổ ong', desc: 'Vải ép tráng bạc bên trong, cản sáng 100%, cách nhiệt.' },
          { title: 'Hệ thống kéo độc lập', desc: 'Có thể kéo 1 bên lưới, 1 bên rèm hoặc thu gọn toàn bộ.' }
        ];
      } else if (s.includes('chong-trom') || s.includes('inox')) {
        heroSubtitle = `Bảo vệ an toàn tuyệt đối 2 lớp với <strong>${catName}</strong>. Ngăn chặn sự xâm nhập của kẻ gian, thú hoang và mọi loại côn trùng.`;
        benefits = [
          { title: "An toàn chống trộm", desc: "Lưới inox 316 siêu cứng, dao kéo không thể cắt đứt." },
          { title: "Chống muỗi hoàn hảo", desc: "Mắt lưới nhỏ ngăn 100% các loại côn trùng xâm nhập." },
          { title: "Chịu lực tuyệt đối", desc: "Chịu được lực va đập mạnh, chống lại sự phá hoại." },
          { title: "Cứng cáp bền bỉ", desc: "Khung nhôm bản siêu dày, không gỉ sét, tuổi thọ trọn đời." }
        ];
        intro = [
          `<strong>${catName}</strong> là sự nâng cấp hoàn hảo với việc sử dụng lưới inox 316 sợi to và hệ khung nhôm bản lớn cực kỳ chắc chắn.`,
          `Sản phẩm này có khả năng chịu lực va đập lớn, ngăn chặn hiệu quả ý đồ xâm nhập của kẻ gian, bảo vệ an toàn cho cả tài sản và sức khỏe của bạn.`
        ];
        applications = ['Cửa đi chính', 'Cửa sổ không song sắt', 'Cửa sau nhà', 'Cửa ban công các tầng thấp'];
        components = [
          { title: 'Khung nhôm bản dày', desc: 'Hợp kim nhôm siêu cứng, dày 1.4mm - 2mm chịu lực tốt.' },
          { title: 'Lưới Inox 316 đan chéo', desc: 'Sợi inox dày 0.6mm - 0.8mm siêu cứng, chống cắt phá.' },
          { title: 'Hệ thống khóa chốt', desc: 'Khóa đa điểm an toàn tuyệt đối, chống cạy mở.' },
          { title: 'Phụ kiện bản lề/bánh xe', desc: 'Đồng bộ cao cấp, chịu tải trọng lớn của toàn bộ cánh.' }
        ];
      } else {
        intro = [
          `<strong>${catName}</strong> là hệ thống cửa lưới bảo vệ toàn diện, ngăn chặn muỗi và các bệnh truyền nhiễm nguy hiểm.`,
          `Với thiết kế hiện đại, sản phẩm mang đến không gian thoáng đãng, sạch sẽ và cực kỳ an toàn cho sức khỏe gia đình bạn.`
        ];
        applications = ['Cửa sổ phòng ngủ', 'Cửa phòng khách', 'Cửa ra ban công', 'Ô thông gió'];
        components = [
          { title: 'Khung nhôm cao cấp', desc: 'Được sơn tĩnh điện, chắc chắn, chống oxy hóa.' },
          { title: 'Lưới chống muỗi', desc: 'Lưới sợi thủy tinh/inox, độ bền cao, không rỉ.' },
          { title: 'Ke góc & phụ kiện', desc: 'Liên kết chắc chắn, đảm bảo độ bền và thẩm mỹ.' },
          { title: 'Hệ thống vận hành', desc: 'Thiết kế chuẩn kỹ thuật, dễ dàng sử dụng và bảo dưỡng.' }
        ];
      }
    } else if (s.includes('rem') || parentS.includes('rem')) {
      fallbackImage1 = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
      fallbackImage2 = 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80';
      if (s.includes('vai')) {
        heroSubtitle = `Nâng tầm không gian sống với bộ sưu tập <strong>${catName}</strong> cao cấp. Mềm mại, sang trọng, cản sáng 100% và cách âm hiệu quả.`;
        benefits = [
          { title: "Cản sáng tuyệt đối", desc: "Bảo vệ giấc ngủ sâu, ngăn chặn tia UV gây hại." },
          { title: "Cách âm cách nhiệt", desc: "Giữ nhiệt độ phòng luôn mát mẻ, tiết kiệm điện năng." },
          { title: "Đa dạng chất liệu", desc: "Vải gấm, bố, voan cao cấp an toàn cho sức khỏe." },
          { title: "May đo chuẩn phom", desc: "Đường may sắc nét, sóng rèm đổ suôn mượt, tinh tế." }
        ];
        intro = [
          `<strong>${catName}</strong> mang lại sự mềm mại, ấm cúng và vẻ đẹp sang trọng vượt thời gian cho mọi không gian sống.`,
          `Được làm từ chất liệu vải cao cấp, sản phẩm có khả năng cản sáng cực tốt, cách âm và cản nhiệt hiệu quả.`
        ];
        applications = ['Phòng ngủ gia đình', 'Phòng khách sang trọng', 'Khách sạn, Resort', 'Biệt thự, chung cư cao cấp'];
        components = [
          { title: 'Chất liệu vải', desc: 'Vải gấm, thô, voan... nhập khẩu cao cấp, chống bám bụi.' },
          { title: 'Thanh treo', desc: 'Hợp kim nhôm siêu bền, chịu lực tốt, thiết kế thanh lịch.' },
          { title: 'Kiểu may', desc: 'Đa dạng từ xếp ly, ô rê đến định hình sóng suôn mượt.' },
          { title: 'Phụ kiện', desc: 'Dây vén rèm, núm treo đồng bộ, tôn lên vẻ tinh tế.' }
        ];
      } else if (s.includes('cau-vong')) {
        heroSubtitle = `Điều chỉnh ánh sáng linh hoạt với <strong>${catName}</strong> Hàn Quốc. Thiết kế 2 lớp đan xen hiện đại, gọn gàng, tinh tế.`;
        benefits = [
          { title: "Lấy sáng linh hoạt", desc: "Dễ dàng điều tiết ánh sáng qua các lớp vải đan xen." },
          { title: "Thiết kế hiện đại", desc: "Gọn gàng, không chiếm diện tích, phù hợp kiến trúc mới." },
          { title: "Chống nắng, cản UV", desc: "Vải polyester cao cấp cản nắng lên tới 99%." },
          { title: "Dễ dàng vệ sinh", desc: "Bề mặt chống bám bụi, chỉ cần dùng chổi lông gà lau nhẹ." }
        ];
        intro = [
          `<strong>${catName}</strong> là sự kết hợp hoàn hảo giữa thiết kế hiện đại của rèm cuốn và khả năng điều chỉnh ánh sáng linh hoạt của rèm sáo.`,
          `Cấu tạo 2 lớp đan xen giúp bạn dễ dàng lấy sáng một nửa hoặc cản sáng tuyệt đối chỉ với một thao tác kéo nhẹ nhàng.`
        ];
        applications = ['Phòng khách hiện đại', 'Phòng ngủ nhỏ', 'Phòng làm việc', 'Không gian quán Cafe'];
        components = [
          { title: 'Vải rèm 2 lớp', desc: 'Lớp vải voan lấy sáng và lớp vải dày cản nắng xen kẽ.' },
          { title: 'Hộp rèm', desc: 'Hợp kim nhôm sơn tĩnh điện che kín trục cuốn thẩm mỹ.' },
          { title: 'Hệ thống kéo', desc: 'Dây kéo dù siêu bền kết hợp bộ truyền động nhẹ nhàng.' },
          { title: 'Thanh đáy', desc: 'Giúp bề mặt rèm luôn phẳng phiu, không bị nhăn.' }
        ];
      } else if (s.includes('cuon')) {
        heroSubtitle = `Giải pháp chống nắng hoàn hảo với <strong>${catName}</strong>. Thiết kế phẳng gọn gàng, độ bền cao, phù hợp không gian tối giản.`;
        benefits = [
          { title: "Tối ưu không gian", desc: "Cuộn tròn gọn gàng trong ống nhôm khi không sử dụng." },
          { title: "Chống nắng cách nhiệt", desc: "Chất liệu phủ nhựa cản sáng 100%, giảm nhiệt độ phòng." },
          { title: "Bền bỉ ít bám bụi", desc: "Bề mặt trơn láng, hạn chế bám bụi tối đa." },
          { title: "Tiết kiệm chi phí", desc: "Giá thành siêu tốt, là lựa chọn số 1 cho văn phòng và trường học." }
        ];
        intro = [
          `<strong>${catName}</strong> mang phong cách tối giản, hiện đại, hoạt động theo cơ chế cuộn thả trơn tru như cửa cuốn.`,
          `Sản phẩm này đặc biệt phù hợp với các không gian làm việc hoặc phòng ngủ cần sự cản sáng tuyệt đối mà không chiếm diện tích.`
        ];
        applications = ['Văn phòng công ty', 'Không gian làm việc', 'Cửa sổ phòng bếp', 'Phòng ngủ phong cách tối giản'];
        components = [
          { title: 'Vải rèm cuốn', desc: 'Vải Polyester phủ nhựa chống thấm, chống nắng 100%.' },
          { title: 'Trục cuốn nhôm', desc: 'Ống nhôm đúc chịu lực, cuộn vải rèm cực kỳ êm ái.' },
          { title: 'Hệ thống kéo', desc: 'Dây kéo hạt nhựa độ bền cao hoặc motor tự động.' },
          { title: 'Thanh đáy rèm', desc: 'Thanh nhôm chịu lực làm đối trọng giúp rèm luôn phẳng.' }
        ];
      } else if (s.includes('sao')) {
        heroSubtitle = `Điều tiết ánh sáng nghệ thuật với <strong>${catName}</strong>. Khả năng xoay lật lá rèm 180 độ thông minh, kiểm soát tầm nhìn tối đa.`;
        benefits = [
          { title: "Xoay lật 180 độ", desc: "Kiểm soát chính xác lượng ánh sáng vào phòng." },
          { title: "Chất liệu đa dạng", desc: "Lá nhôm sơn tĩnh điện hoặc lá gỗ tự nhiên cao cấp." },
          { title: "Tuổi thọ cao", desc: "Chống cong vênh, không sợ môi trường ẩm ướt." },
          { title: "Thiết kế hiện đại", desc: "Mang lại vẻ đẹp sắc sảo, chuyên nghiệp cho không gian." }
        ];
        intro = [
          `<strong>${catName}</strong> là hệ rèm bao gồm nhiều lá mỏng ngang xếp chồng lên nhau, cho phép điều chỉnh ánh sáng và tầm nhìn một cách vô cùng linh hoạt.`,
          `Bạn có thể chớp lật lá rèm để lấy ánh sáng tự nhiên mà vẫn giữ được sự riêng tư hoàn hảo cho căn phòng.`
        ];
        applications = ['Phòng làm việc giám đốc', 'Phòng tắm, vệ sinh (Rèm sáo nhôm)', 'Phòng khách cổ điển (Rèm sáo gỗ)', 'Quán cafe phong cách'];
        components = [
          { title: 'Lá rèm sáo', desc: 'Bản lá 25mm hoặc 50mm, chất liệu nhôm hoặc gỗ.' },
          { title: 'Hộp máng rèm', desc: 'Chứa hệ thống bộ phận cơ chuyển động xoay lật.' },
          { title: 'Dây kéo và dây lật', desc: 'Sử dụng hệ thống dây dù độ bền cao, không đứt gãy.' },
          { title: 'Chốt định vị', desc: 'Giữ các lá rèm cố định không bị xô lệch khi có gió.' }
        ];
      } else if (s.includes('la-doc')) {
        heroSubtitle = `Giải pháp tối ưu cho vách kính lớn với <strong>${catName}</strong>. Xoay lật nhẹ nhàng, thu rèm sang 2 bên tiện lợi.`;
        benefits = [
          { title: "Che phủ diện tích lớn", desc: "Sự lựa chọn số 1 cho các vách kính, cửa ra vào rộng." },
          { title: "Điều chỉnh ánh sáng tốt", desc: "Các lá rèm dọc có thể xoay 180 độ để lấy sáng." },
          { title: "Linh hoạt đóng mở", desc: "Dễ dàng thu dạt toàn bộ lá rèm về 1 hoặc 2 bên." },
          { title: "Vệ sinh cực kỳ dễ", desc: "Lá rèm dọc phủ nhựa nên ít bám bụi, dễ dàng lau chùi." }
        ];
        intro = [
          `<strong>${catName}</strong> là hệ rèm với các lá vải thả dọc từ trên xuống, tạo cảm giác trần nhà cao hơn và không gian rộng mở hơn.`,
          `Sản phẩm này thường được ưa chuộng tại các văn phòng làm việc và những nơi có cửa sổ kính kích thước lớn.`
        ];
        applications = ['Vách kính văn phòng', 'Cửa sổ kích thước lớn', 'Showroom trưng bày', 'Phòng họp công ty'];
        components = [
          { title: 'Lá rèm dọc', desc: 'Bản 89mm hoặc 100mm, sợi Polyester chống nắng cản nhiệt.' },
          { title: 'Thanh ray nhôm', desc: 'Ray chữ U dày dặn, chứa các con lăn trượt êm ái.' },
          { title: 'Dây chuỗi liên kết', desc: 'Dây bi xâu chuỗi ở chân rèm giúp các lá rèm không bay lộn xộn.' },
          { title: 'Hệ thống kéo xoay', desc: 'Tích hợp dây kéo dạt rèm và dây chuỗi xoay lật lá.' }
        ];
      } else {
        intro = [
          `<strong>${catName}</strong> không chỉ có tác dụng cản sáng, chống nắng mà còn là mảnh ghép hoàn hảo nâng tầm kiến trúc nội thất.`,
          `Chất liệu cao cấp kết hợp cùng hệ phụ kiện trơn tru mang đến trải nghiệm kéo/mở nhẹ nhàng, tạo không gian riêng tư lý tưởng.`
        ];
        applications = ['Phòng ngủ gia đình', 'Phòng khách sang trọng', 'Văn phòng làm việc', 'Không gian Spa, Khách sạn'];
        components = [
          { title: 'Hệ thanh treo', desc: 'Nhôm hợp kim hoặc gỗ tự nhiên, thiết kế tối giản.' },
          { title: 'Chất liệu vải', desc: 'Khả năng cản nắng 100%, cách nhiệt và giảm tiếng ồn.' },
          { title: 'Hệ thống kéo', desc: 'Dây bi/dây dù hoặc động cơ tự động vận hành êm ái.' },
          { title: 'Phụ kiện đi kèm', desc: 'Tay núm, khoen rèm đồng bộ, tăng tính thẩm mỹ.' }
        ];
      }
    } else if (s.includes('tam-op') || s.includes('nhua-op') || parentS.includes('tam-op')) {
      fallbackImage1 = 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80';
      fallbackImage2 = 'https://images.unsplash.com/photo-1599427301072-50d4f3b25d05?auto=format&fit=crop&w=800&q=80';
      if (s.includes('nano')) {
        heroSubtitle = `Xóa sổ tường ẩm mốc với <strong>${catName}</strong>. Thi công siêu tốc, bề mặt vân sắc nét, chống cháy, chống mối mọt trọn đời.`;
        benefits = [
          { title: "Chống nước, chống mốc", desc: "Chất liệu nhựa PVC siêu bền, nói không với ẩm mốc." },
          { title: "Cách âm, cách nhiệt", desc: "Cấu trúc rỗng giúp tiêu âm, điều hòa nhiệt độ phòng." },
          { title: "Thi công siêu tốc", desc: "Lắp đặt trực tiếp lên tường cũ mà không cần cạo trát." },
          { title: "Thẩm mỹ cao cấp", desc: "Vân gỗ, vân đá chân thực, sang trọng như vật liệu tự nhiên." }
        ];
        intro = [
          `<strong>${catName}</strong> có cấu trúc ô rỗng kết hợp hèm khóa, là giải pháp hàng đầu cải tạo tường cũ, thấm mốc.`,
          `Bề mặt phủ màng PVC đa dạng vân gỗ, vân đá mang đến sự sang trọng, đồng thời cách âm và cách nhiệt hoàn hảo.`
        ];
        applications = ['Cải tạo tường ẩm mốc', 'Ốp vách tivi, đầu giường', 'Ốp toàn bộ phòng khách', 'Trần nhà chống nóng'];
        components = [
          { title: 'Cốt nhựa Nano', desc: 'Nhựa nguyên sinh phối hợp bột đá, chịu lực và chống cháy lan.' },
          { title: 'Cấu trúc lỗ rỗng', desc: 'Tăng cường khả năng cách âm, cách nhiệt hiệu quả.' },
          { title: 'Màng phủ bề mặt', desc: 'Film vân gỗ, vân đá sinh động, sắc nét như thật.' },
          { title: 'Ngàm khóa thông minh', desc: 'Thiết kế hèm âm dương thi công nhanh, che khuyết điểm đinh vít.' }
        ];
      } else if (s.includes('lam-song')) {
        heroSubtitle = `Kiến tạo không gian 3D đẳng cấp với <strong>${catName}</strong>. Điểm nhấn hoàn hảo, chống trầy xước, không cong vênh.`;
        benefits = [
          { title: "Điểm nhấn 3D độc đáo", desc: "Cấu trúc gợn sóng nổi 3D mang lại sự sang trọng, phá cách." },
          { title: "Chống va đập cực tốt", desc: "Cốt nhựa đặc kết hợp bột gỗ, chịu lực va đập cực kỳ ấn tượng." },
          { title: "Che giấu khuyết điểm", desc: "Thiết kế dạng sóng dễ dàng che giấu các đường dây điện trên tường." },
          { title: "Bền bỉ thách thức thời gian", desc: "Không co ngót, không phai màu dưới mọi điều kiện thời tiết." }
        ];
        intro = [
          `<strong>${catName}</strong> mang đậm hơi thở kiến trúc hiện đại, đem đến hiệu ứng sóng nổi 3D lạ mắt giúp không gian bớt đi sự đơn điệu.`,
          `Sản phẩm này thường được sử dụng làm điểm nhấn trang trí, đem lại sự sang trọng và chiều sâu cho tổng thể kiến trúc nội thất.`
        ];
        applications = ['Vách nền tivi', 'Mảng tường cầu thang', 'Background lễ tân', 'Trần nhà ban công'];
        components = [
          { title: 'Lớp cốt nhựa Composite', desc: 'Nhựa dẻo dai phối hợp bột đá siêu bền, chống giòn gãy.' },
          { title: 'Màng Film vân gỗ', desc: 'Ép nhiệt ở nhiệt độ cao, vân sóng nổi bật sắc nét.' },
          { title: 'Lớp phủ UV bảo vệ', desc: 'Tăng khả năng chống xước bề mặt và chống phai màu.' },
          { title: 'Cấu trúc lam 3, 4, 5 sóng', desc: 'Thiết kế theo Module dễ dàng ghép mí nối tiếp nhau liên tục.' }
        ];
      } else if (s.includes('pvc') || s.includes('van-da')) {
        heroSubtitle = `Thay thế hoàn hảo đá tự nhiên với <strong>${catName}</strong>. Sáng bóng, sang trọng, trọng lượng nhẹ, thi công cực nhanh.`;
        benefits = [
          { title: "Vẻ đẹp sang trọng", desc: "Vân đá cẩm thạch tự nhiên, độ bóng cao (High Gloss)." },
          { title: "Siêu chống thấm", desc: "Hoàn toàn không thấm nước, lý tưởng cho cả khu vực bếp, vệ sinh." },
          { title: "Trọng lượng siêu nhẹ", desc: "Nhẹ hơn đá thật 10 lần, dễ dàng ốp trên cao mà không lo sập tường." },
          { title: "Tiết kiệm 70% chi phí", desc: "Chi phí vật tư và nhân công thi công rẻ hơn rất nhiều so với đá tự nhiên." }
        ];
        intro = [
          `<strong>${catName}</strong> là vật liệu đột phá thay thế cho đá Marble/Granite đắt đỏ, nặng nề.`,
          `Với độ sáng bóng cực cao cùng các đường vân đá sinh động, sản phẩm đem lại sự xa hoa, đẳng cấp mà lại vô cùng tiết kiệm chi phí.`
        ];
        applications = ['Ốp vách Tivi sang trọng', 'Ốp tường phòng tắm, toilet', 'Ốp thang máy', 'Khu vực bếp nấu ăn'];
        components = [
          { title: 'Cốt nhựa PVC rắn', desc: 'Nhựa nguyên sinh phối hợp bột đá tự nhiên, chịu lực cao.' },
          { title: 'Lớp vân đá PVC', desc: 'In hoa văn vân đá cẩm thạch sắc nét giống đá thật tới 95%.' },
          { title: 'Lớp phủ High Gloss', desc: 'Tạo độ sáng bóng gương, chống xước, chống ẩm mốc.' },
          { title: 'Lớp keo dán chuyên dụng', desc: 'Sử dụng keo Titebond siêu dính bám chắc vĩnh viễn vào tường.' }
        ];
      } else {
        intro = [
          `<strong>${catName}</strong> là vật liệu trang trí thế hệ mới, giải pháp khắc phục triệt để tình trạng tường ẩm mốc, bong tróc.`,
          `Sản phẩm có màng vân sắc nét, thi công nhanh chóng không bụi bẩn, mang lại vẻ đẹp sang trọng và bền bỉ hàng chục năm.`
        ];
        applications = ['Ốp vách Tivi', 'Cải tạo tường cũ mốc', 'Ốp trần nhà', 'Trang trí sảnh lễ tân'];
        components = [
          { title: 'Cốt nhựa', desc: 'Chống nước 100%, không mối mọt, an toàn không độc hại.' },
          { title: 'Lớp màng vân', desc: 'In 3D sắc nét vân gỗ/đá, phủ UV chống bay màu.' },
          { title: 'Ngàm âm dương', desc: 'Thiết kế thông minh giúp ghép nối khít sát, giấu vít.' },
          { title: 'Phào nẹp đồng bộ', desc: 'Che khuyết điểm mép cắt, tạo điểm nhấn hoàn hảo.' }
        ];
      }
    } else if (s.includes('giay-dan') || s.includes('tranh-dan') || s.includes('tranh-') || parentS.includes('giay-dan') || parentS.includes('tranh-dan')) {
      fallbackImage1 = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
      fallbackImage2 = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
      if (s.includes('giay-dan')) {
        heroSubtitle = `Khoác áo mới cho không gian với <strong>${catName}</strong> cao cấp. Mẫu mã đa dạng, chống trầy xước, an toàn tuyệt đối cho sức khỏe.`;
        benefits = [
          { title: "Đa dạng phong cách", desc: "Hàng ngàn mẫu mã từ hiện đại, tối giản đến tân cổ điển." },
          { title: "Chống bám bẩn", desc: "Bề mặt phủ Vinyl dễ dàng lau chùi bằng khăn ẩm." },
          { title: "Thân thiện sức khỏe", desc: "Nguyên liệu tự nhiên, mực in không mùi độc hại." },
          { title: "Thi công nhanh gọn", desc: "Hoàn thiện một phòng ngủ chỉ trong vòng 2-3 tiếng." }
        ];
        intro = [
          `<strong>${catName}</strong> mang phong cách nhẹ nhàng, đa dạng họa tiết từ trơn màu tối giản đến hoa văn tân cổ điển sang trọng.`,
          `Thi công nhanh chóng, không mùi độc hại, giúp làm mới không gian sống một cách tiết kiệm và cực kỳ ấn tượng.`
        ];
        applications = ['Phòng ngủ gia đình', 'Điểm nhấn phòng khách', 'Phòng trẻ em', 'Cửa hàng, shop quần áo'];
        components = [
          { title: 'Lớp đế giấy', desc: 'Dày dặn, bám dính cực tốt vào bề mặt tường xử lý phẳng.' },
          { title: 'Bề mặt Vinyl', desc: 'Chống xước, chống bám bụi, dễ lau chùi bằng khăn ẩm.' },
          { title: 'Họa tiết', desc: 'Công nghệ in nổi 3D hiện đại, màu sắc tự nhiên.' },
          { title: 'Keo dán', desc: 'Keo bột kết hợp keo sữa tăng độ bám, chống nấm mốc.' }
        ];
      } else if (s.includes('tranh-binh-hoa')) {
        heroSubtitle = `Mang vẻ đẹp nghệ thuật lãng mạn vào ngôi nhà với <strong>${catName}</strong> 3D. Độ phân giải cao, lụa kim tuyến sang trọng, bền màu 10 năm.`;
        benefits = [
          { title: "Độ sắc nét 3D/5D", desc: "Hình ảnh chân thực, sống động, tạo chiều sâu cho không gian." },
          { title: "Lụa nguyên khổ", desc: "Tranh in nguyên tấm không ghép nối, xé không rách." },
          { title: "Công nghệ in UV", desc: "Mực in sinh thái chống bay màu, an toàn tuyệt đối." },
          { title: "Kích thước theo yêu cầu", desc: "Thiết kế và in ấn chuẩn xác theo từng mảng tường." }
        ];
        intro = [
          `<strong>${catName}</strong> là dòng tranh 3D dán tường chuyên đề hoa cỏ, mang thiên nhiên tươi mới vào trong ngôi nhà bạn.`,
          `Màu sắc rực rỡ, độ phân giải sắc nét tạo chiều sâu không gian, phù hợp cho những ai yêu thích sự lãng mạn, tinh tế.`
        ];
        applications = ['Vách tivi phòng khách', 'Mảng tường đầu giường', 'Phòng ăn, nhà bếp', 'Hành lang, lối đi'];
        components = [
          { title: 'Chất liệu in', desc: 'Vải lụa nguyên khối siêu bền, không ghép nối, xé không rách.' },
          { title: 'Mực in UV/Kháng nước', desc: 'Công nghệ in nổi UV Mỹ cho màu sắc sống động, độ bền >10 năm.' },
          { title: 'Lớp phủ bảo vệ', desc: 'Chống nước bề mặt, chống phai màu và chống trầy xước.' },
          { title: 'Thi công', desc: 'Lăn keo trực tiếp, bề mặt phẳng phiu hoàn hảo.' }
        ];
      } else if (s.includes('tranh-phong-canh') || s.includes('canh-bien') || s.includes('con-duong')) {
        heroSubtitle = `Mở rộng không gian vô tận với <strong>${catName}</strong>. Chủ đề phong cảnh thiên nhiên hùng vĩ, mang lại cảm giác thư thái tuyệt vời.`;
        benefits = [
          { title: "Mở rộng không gian", desc: "Tạo cảm giác căn phòng rộng rãi, thoáng đãng hơn." },
          { title: "In 3D/5D siêu thực", desc: "Độ nổi và chiều sâu không gian chân thực đến ngỡ ngàng." },
          { title: "Độ bền vượt trội", desc: "Chống nước, chống ẩm mốc, màu sắc tươi mới trên 10 năm." },
          { title: "Thiết kế đo đạc", desc: "Tùy chỉnh bố cục tranh phù hợp hoàn hảo với tường nhà." }
        ];
        intro = [
          `<strong>${catName}</strong> mở ra không gian rộng lớn, hùng vĩ ngay trong nhà với các chủ đề thiên nhiên bao la, cảnh biển tươi mát hay những con đường sâu thẳm.`,
          `Sản phẩm tạo hiệu ứng thị giác mở rộng không gian cực tốt, rất thích hợp cho những căn phòng có diện tích hạn chế.`
        ];
        applications = ['Phòng khách nhỏ hẹp', 'Sảnh công ty, văn phòng', 'Phòng làm việc', 'Không gian thiền, Spa'];
        components = [
          { title: 'Chất liệu lụa', desc: 'Vải lụa nguyên khổ không ghép nối.' },
          { title: 'Công nghệ in 3D/5D', desc: 'Tạo chiều sâu và độ chân thực tối đa cho phong cảnh.' },
          { title: 'Xử lý hình ảnh', desc: 'File gốc siêu nét, không bị vỡ hạt khi in kích thước lớn.' },
          { title: 'Thiết kế theo yêu cầu', desc: 'Canh chỉnh bố cục vừa khít với kích thước bức tường thực tế.' }
        ];
      } else if (s.includes('ma-dao-thanh-cong') || s.includes('tranh-ca') || s.includes('anh-hung-tuong-ngo')) {
        heroSubtitle = `Thu hút tài lộc, vượng khí với <strong>${catName}</strong> phong thủy. Từng đường nét được in nổi 5D sắc sảo, đẳng cấp.`;
        benefits = [
          { title: "Ý nghĩa phong thủy", desc: "Kích hoạt tài lộc, mang lại sự may mắn và thành công." },
          { title: "Chi tiết sắc nét", desc: "In nổi 5D/8D, công nghệ rắc kim tuyến lấp lánh sang trọng." },
          { title: "Mực in UV Mỹ", desc: "Không phai màu, không bong tróc, tuổi thọ lên tới 20 năm." },
          { title: "Dễ dàng vệ sinh", desc: "Bề mặt chống nước, lau chùi bằng khăn ướt thoải mái." }
        ];
        intro = [
          `<strong>${catName}</strong> thuộc dòng tranh phong thủy truyền thống, mang ý nghĩa vô cùng sâu sắc về sự phát đạt, thịnh vượng và sức mạnh.`,
          `Bức tranh không chỉ là điểm nhấn quyền uy cho phòng khách mà còn là lời chúc may mắn dành cho gia chủ.`
        ];
        applications = ['Phòng khách gia đình', 'Phòng làm việc Giám đốc', 'Sảnh tiếp khách', 'Quà tặng tân gia'];
        components = [
          { title: 'Chất liệu in', desc: 'Vải lụa bóng/lụa kim tuyến nguyên tấm cao cấp.' },
          { title: 'Công nghệ in', desc: 'Mực in UV nổi 5D, phủ bóng màng bảo vệ siêu bền.' },
          { title: 'Thiết kế', desc: 'Canh chỉnh vị trí phong thủy, cân đối tỷ lệ chuẩn xác.' },
          { title: 'Keo dán', desc: 'Keo nếp Hàn Quốc chuyên dụng siêu dính, an toàn sức khỏe.' }
        ];
      } else if (s.includes('tre-em') || s.includes('canh-thien-than')) {
        heroSubtitle = `Khơi nguồn sáng tạo cho bé với <strong>${catName}</strong>. Hình ảnh sinh động, dễ thương, mực in 100% an toàn tuyệt đối.`;
        benefits = [
          { title: "An toàn tuyệt đối", desc: "Mực in Eco-Solvent sinh thái, không chứa chất độc hại." },
          { title: "Kích thích sáng tạo", desc: "Chủ đề hoạt hình, động vật sinh động giúp bé phát triển trí não." },
          { title: "Dễ dàng lau chùi", desc: "Bề mặt phủ Vinyl chống bám bẩn, dễ vệ sinh khi bé vẽ bậy." },
          { title: "Màu sắc tươi sáng", desc: "Bền màu theo thời gian, đem lại không gian vui tươi." }
        ];
        intro = [
          `<strong>${catName}</strong> được thiết kế dành riêng cho không gian của các thiên thần nhỏ, mang những màu sắc vui tươi và thế giới cổ tích vào phòng bé.`,
          `Sản phẩm cam kết sử dụng vật liệu xanh, mực in không mùi độc hại, bảo vệ hệ hô hấp và làn da nhạy cảm của trẻ.`
        ];
        applications = ['Phòng ngủ bé trai/bé gái', 'Trường mầm non', 'Khu vui chơi trẻ em', 'Phòng khám nhi'];
        components = [
          { title: 'Vật liệu nền', desc: 'Giấy Hàn Quốc hoặc Lụa nguyên khối mềm mại.' },
          { title: 'Mực in', desc: 'Mực nước/Eco sinh thái không mùi, chứng nhận an toàn.' },
          { title: 'Chủ đề', desc: 'Vũ trụ, thế giới động vật, công chúa, thiên thần...' },
          { title: 'Lớp phủ bề mặt', desc: 'Phủ nano chống xước, chịu được ma sát nhẹ.' }
        ];
      } else if (s.includes('3d-hien-dai') || s.includes('ban-do')) {
        heroSubtitle = `Định hình không gian sống phong cách với <strong>${catName}</strong>. Họa tiết hình học 3D, bản đồ thế giới trừu tượng ấn tượng.`;
        benefits = [
          { title: "Phong cách tối giản", desc: "Phù hợp với kiến trúc hiện đại, không rườm rà." },
          { title: "Hiệu ứng 3D ảo giác", desc: "Tạo chiều sâu và sự khác biệt độc đáo cho bức tường." },
          { title: "In ấn siêu nét", desc: "Các khối hình học, đường line sắc sảo, không bị mờ nhòe." },
          { title: "Vật liệu siêu bền", desc: "Chống nước, chống mốc, chịu lực xé tốt." }
        ];
        intro = [
          `<strong>${catName}</strong> mang đậm tính nghệ thuật đương đại, sử dụng các mảng màu, hình khối 3D hoặc bản đồ thế giới cách điệu.`,
          `Đây là sự lựa chọn hoàn hảo cho những gia chủ yêu thích sự cá tính, muốn tạo ra một không gian đầy cảm hứng và sáng tạo.`
        ];
        applications = ['Phòng làm việc sáng tạo', 'Căn hộ Studio hiện đại', 'Văn phòng IT', 'Phòng khách phong cách Minimalist'];
        components = [
          { title: 'Chất liệu lụa', desc: 'Lụa bóng/lụa sần nguyên khổ cao cấp.' },
          { title: 'Thiết kế đồ họa', desc: 'Các file Vector sắc nét, in mọi kích thước không vỡ.' },
          { title: 'Công nghệ in UV', desc: 'Làm nổi bật các đường line, tạo hiệu ứng phản quang.' },
          { title: 'Quy trình dán', desc: 'Căn chỉnh mép chuẩn xác, giữ nguyên tỷ lệ hình khối.' }
        ];
      } else if (s.includes('cafe') || s.includes('bar') || s.includes('tra-sua')) {
        heroSubtitle = `Tạo điểm check-in cực chất với <strong>${catName}</strong>. Thiết kế độc quyền, phong cách Vintage/Retro cuốn hút khách hàng.`;
        benefits = [
          { title: "Thu hút khách hàng", desc: "Tạo không gian check-in sống ảo cực chill cho quán." },
          { title: "Đa dạng chủ đề", desc: "Từ Retro, Vintage, Typography đến phong cách nhiệt đới." },
          { title: "Tiết kiệm chi phí Decor", desc: "Thay vì sơn vẽ thủ công đắt đỏ, dán tranh nhanh và rẻ hơn." },
          { title: "Chống bám khói bụi", desc: "Bề mặt phủ bóng dễ dàng lau chùi các vết bẩn, khói thuốc." }
        ];
        intro = [
          `<strong>${catName}</strong> là bí quyết "lột xác" không gian kinh doanh chỉ trong 1 ngày thi công, giúp quán của bạn trở nên nổi bật và có gu hơn.`,
          `Với hàng ngàn mẫu mã đa dạng, sản phẩm dễ dàng đáp ứng mọi concept thiết kế từ bụi bặm đường phố đến sang trọng, ấm cúng.`
        ];
        applications = ['Quán Cafe, Trà sữa', 'Quán Bar, Pub, Lounge', 'Nhà hàng ẩm thực', 'Tiệm tóc, Salon, Spa'];
        components = [
          { title: 'Chất liệu', desc: 'Vải lụa nguyên khối hoặc Giấy dán tường nhập khẩu.' },
          { title: 'Chủ đề', desc: 'Typography chữ, bản đồ cafe, lá cây nhiệt đới, nghệ thuật đường phố.' },
          { title: 'Mực in', desc: 'Mực UV chống bay màu ngay cả khi có ánh nắng hắt vào.' },
          { title: 'Bề mặt phủ', desc: 'Chống thấm nước cường độ cao, hạn chế bám hơi ẩm/dầu mỡ.' }
        ];
      } else {
        intro = [
          `<strong>${catName}</strong> biến những bức tường đơn điệu trở nên sống động chỉ trong nháy mắt với công nghệ in sắc nét.`,
          `Sử dụng chất liệu cao cấp không mùi, an toàn tuyệt đối, đem lại không gian tươi mới, đậm dấu ấn cá nhân.`
        ];
        applications = ['Trang trí mảng tường lớn', 'Điểm nhấn phòng khách', 'Cải tạo phòng cũ', 'Quán Cafe, Spa'];
        components = [
          { title: 'Vật liệu nền', desc: 'Lụa nguyên khối hoặc giấy Hàn Quốc cao cấp.' },
          { title: 'Công nghệ in', desc: 'Mực UV/Eco-Solvent sinh thái, an toàn cho trẻ.' },
          { title: 'Bề mặt phủ', desc: 'Chống ẩm, dễ lau chùi, không bám bụi.' },
          { title: 'Keo dán chuyên dụng', desc: 'Tăng cường độ bám dính, không bong tróc mí.' }
        ];
      }
    }

    return { intro, applications, components, fallbackImage1, fallbackImage2, heroSubtitle, benefits };
  };

  const subCatContent = getSubCategoryContent(slug, categoryName, parentCategory?.slug);

  // ==========================================
  // LANDING PAGE LAYOUT FOR SUB-CATEGORIES
  // ==========================================
  if (isSubCategory) {
    return (
    <div className="bg-white">
      {/* HERO SECTION */}
        <section className="pt-8 pb-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            {/* Breadcrumb inline in Hero */}
            <div className="flex flex-wrap items-center text-[13px] text-gray-500 mb-6 gap-y-1">
               <Link href="/" className="hover:text-primary transition">Trang chủ</Link>
               <span className="mx-2">/</span>
               {parentCategory && (
                 <>
                   <Link href={`/danh-muc/${parentCategory.slug}`} className="hover:text-primary transition">{parentCategory.name}</Link>
                   <span className="mx-2">/</span>
                 </>
               )}
               <span className="text-gray-900 font-medium">{categoryName}</span>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                {/* Title split if possible, but we use categoryName */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary uppercase leading-tight mb-2">
                  {categoryName}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-medium mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: subCatContent.heroSubtitle || parentContent.heroSubtitle }} />
                
                <ul className="space-y-3 mb-8">
                  {(subCatContent.benefits?.length > 0 ? subCatContent.benefits : parentContent.benefits).slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium"><strong>{benefit.title}</strong> - {benefit.desc}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4 mb-8">
                  <a href="tel:0766444789" className="bg-primary hover:bg-sky-800 text-white px-8 py-3.5 rounded-full font-bold flex items-center shadow-lg transition">
                    <PhoneCall className="w-5 h-5 mr-2" /> KHẢO SÁT MIỄN PHÍ
                  </a>
                  <a href="https://zalo.me/0766444789" className="bg-white border-2 border-primary text-primary hover:bg-gray-50 px-8 py-3.5 rounded-full font-bold flex items-center shadow-md transition">
                    <MessageCircle className="w-5 h-5 mr-2" /> NHẬN TƯ VẤN NGAY
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  {currentFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <feat.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                      <span className="text-[11px] font-bold text-gray-700 leading-tight" dangerouslySetInnerHTML={{ __html: feat.text }}></span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] overflow-hidden shadow-2xl relative bg-gray-100">
                  {products[0]?.image_url ? (
                     <Image src={products[0].image_url} alt={categoryName} fill className="object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">Không có hình ảnh</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GIỚI THIỆU & PHÙ HỢP CHO */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-[3]">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase mb-4">{categoryName} LÀ GÌ?</h2>
                <div className="text-gray-700 leading-relaxed space-y-3 font-medium">
                  {subCatContent.intro.map((p, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ __html: p }}></p>
                  ))}
                </div>
                <a href="#san-pham" className="inline-block mt-4 border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-full font-semibold transition text-sm">
                  Xem Thêm Về {categoryName}
                </a>
              </div>
              <div className="flex-[2] bg-gray-50 p-6 rounded-xl border border-gray-100 flex gap-6">
                <div className="flex-1">
                  <h3 className="font-bold text-primary mb-4">PHÙ HỢP CHO</h3>
                  <ul className="space-y-3">
                    {subCatContent.applications.map((app, idx) => (
                      <li key={idx} className="flex items-center text-sm font-medium text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2" /> {app}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-1/3 relative rounded-lg overflow-hidden hidden sm:block">
                  <Image src={subCatContent.fallbackImage1} alt="Phù hợp cho" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUB-CATEGORIES BLOCK FOR MAIN CATEGORIES */}
        {subCategoriesList.length > 0 && (
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">CÁC LOẠI {categoryName}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {subCategoriesList.map((sub) => {
                  const subProduct = products.find(p => p.sub_category_id === sub.id);
                  return (
                    <Link key={sub.id} href={`/danh-muc/${sub.slug}`} className="group block bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                      <div className="aspect-[4/5] overflow-hidden mb-3 relative rounded-lg bg-gray-50">
                        {subProduct?.image_url ? (
                          <Image src={subProduct.image_url} alt={sub.name} fill className="object-cover group-hover:scale-110 transition duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                             <Box className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-[13px] text-gray-800 mb-1 group-hover:text-primary transition">{sub.name}</h3>
                      <p className="text-[11px] text-primary font-semibold">Xem chi tiết &rarr;</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* PRODUCTS LIST */}
        <section id="san-pham" className="py-12 bg-slate-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">CÁC LOẠI {categoryName} PHỔ BIẾN</h2>
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col group">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                      <Image src={product.image_url || ''} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <h3 className="font-bold text-[13px] uppercase mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-[11px] text-gray-500 mb-4 flex-grow line-clamp-2">
                      {product.description ? product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : 'Giải pháp tối ưu cho không gian của bạn.'}
                    </p>
                    <Link href={`/danh-muc-san-pham/${product.slug}`} className="border border-primary text-primary hover:bg-primary hover:text-white py-1.5 rounded-full text-xs font-semibold transition mt-auto w-max mx-auto px-4">
                      XEM CHI TIẾT
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Chưa có sản phẩm nào trong danh mục này.</p>
            )}
            {renderPagination()}
          </div>
        </section>

        {/* PRICING TABLE FOR SUB-CATEGORY */}
        {products && products.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary text-center mb-8 uppercase">BẢNG GIÁ {categoryName}</h2>
              <div className="overflow-x-auto overflow-y-auto max-h-[450px] rounded-2xl border border-gray-200 shadow-sm relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-primary text-white">
                      <th className="p-4 font-bold border-b border-primary/20">Tên sản phẩm</th>
                      <th className="p-4 font-bold border-b border-primary/20 text-right">Đơn giá tham khảo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {products.map((prod, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-gray-800">{prod.name}</td>
                        <td className="p-4 font-bold text-secondary text-right">
                          {prod.sale_price || prod.original_price ? (
                            prod.sale_price || prod.original_price
                          ) : (
                            <a href="tel:0766444789" className="text-primary hover:underline transition">Liên hệ</a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* MID CTA FOR SUB-CATEGORY */}
        <section className="py-12 bg-sky-50 border-y border-sky-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-sky-100 gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">BẠN ĐANG CẦN TƯ VẤN {categoryName.toUpperCase()}?</h2>
                <p className="text-gray-600 text-lg">Gửi hình ảnh qua Zalo để được tư vấn mẫu phù hợp và nhận báo giá nhanh nhất!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <a href="tel:0766444789" rel="nofollow" className="bg-primary hover:bg-sky-800 text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center shadow-lg whitespace-nowrap">
                  <PhoneCall className="w-5 h-5 mr-2" /> 0766 444 789
                </a>
                <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-sky-500 hover:bg-sky-800 text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center shadow-lg whitespace-nowrap">
                  <MessageCircle className="w-5 h-5 mr-2" /> Nhắn tin Zalo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ƯU ĐIỂM VƯỢT TRỘI & CẤU TẠO */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">ƯU ĐIỂM VƯỢT TRỘI</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(subCatContent.benefits?.length > 0 ? subCatContent.benefits : parentContent.benefits).map((benefit, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-[12px] text-gray-500">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">CẤU TẠO SẢN PHẨM</h2>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 relative aspect-square w-full sm:w-auto">
                    <Image src={subCatContent.fallbackImage2} alt="Cấu tạo sản phẩm" fill className="object-cover rounded-xl" />
                  </div>
                  <div className="flex-[1.5] space-y-4">
                    {subCatContent.components.map((comp, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{idx + 1}</div>
                        <div>
                          <h5 className="font-bold text-sm text-primary">{comp.title}</h5>
                          <p className="text-[11px] text-gray-500">{comp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ỨNG DỤNG & QUY TRÌNH */}
        <section className="py-12 bg-slate-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">ỨNG DỤNG THỰC TẾ</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {products.slice(0, 4).map((product, idx) => (
                    <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden group">
                      <Image 
                        src={product.image_url || "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80"} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition duration-500" 
                         
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary to-transparent p-3 pt-10">
                        <p className="text-white font-bold text-[11px] text-center line-clamp-2 px-1">{product.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">QUY TRÌNH THI CÔNG</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 relative">
                  {[
                    { icon: PhoneCall, title: "TIẾP NHẬN YÊU CẦU", desc: "Tư vấn nhu cầu, vị trí cần lắp đặt." },
                    { icon: Ruler, title: "KHẢO SÁT ĐO ĐẠC", desc: "Đo đạc tận nơi, kiểm tra thực tế." },
                    { icon: MessageCircle, title: "TƯ VẤN PHƯƠNG ÁN", desc: "Đề xuất phương pháp và báo giá chi tiết." },
                    { icon: Box, title: "SẢN XUẤT", desc: "Gia công theo kích thước chuẩn xác." },
                    { icon: PenTool, title: "LẮP ĐẶT", desc: "Thi công nhanh chóng, đúng kỹ thuật." },
                    { icon: ShieldCheck, title: "NGHIỆM THU", desc: "Kiểm tra, nghiệm thu & bàn giao." },
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center mb-2 bg-white relative z-10">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-primary text-xs mb-1">0{idx + 1}</div>
                      <h4 className="font-bold text-[12px] text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-[10px] text-gray-500">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary text-center mb-10 uppercase">CÂU HỎI THƯỜNG GẶP (FAQ)</h2>
            <div className="space-y-4">
              {(parentContent.faqs.length > 0 ? parentContent.faqs : [
                { q: `${categoryName} có được bảo hành không?`, a: "Có, tất cả sản phẩm của chúng tôi đều được bảo hành chính hãng từ 2-5 năm tùy dòng sản phẩm." },
                { q: "Thời gian thi công mất bao lâu?", a: "Tùy thuộc vào khối lượng công việc, nhưng thông thường đội ngũ kỹ thuật sẽ hoàn thiện trong ngày để không ảnh hưởng đến sinh hoạt của gia đình." },
                { q: "Tôi có được tư vấn mẫu tại nhà không?", a: "Chắc chắn rồi. Kỹ thuật viên sẽ mang theo catalogue mẫu mã đến tận nơi để khảo sát, đo đạc và tư vấn hoàn toàn miễn phí." }
              ]).map((faq, i) => (
                <details key={i} className="group bg-white border border-gray-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-900">
                    {faq.q}
                    <span className="transition duration-300 group-open:-rotate-180 text-gray-400 font-normal text-xl">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-1">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

    </div>
  );
  }

  

  // ==========================================
  // LANDING PAGE LAYOUT FOR MAIN CATEGORIES
  // ==========================================
  return (
    <div className="bg-white">
      {renderBreadcrumb()}

      {/* 1. HERO SECTION */}
      <section className="bg-slate-50 py-12 md:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              {(parentContent as any).heroHeading ? (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary uppercase leading-tight">
                  {(parentContent as any).heroHeading}
                </h1>
              ) : (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary uppercase leading-tight">
                  {categoryName}
                </h1>
              )}

              {(parentContent as any).heroTypes && (
                <div className="inline-block bg-sky-50 border border-sky-200 text-sky-900 font-semibold px-4 py-2.5 rounded-xl text-sm md:text-base leading-relaxed shadow-sm">
                  {(parentContent as any).heroTypes}
                </div>
              )}

              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl font-medium" dangerouslySetInnerHTML={{ __html: parentContent.heroSubtitle }}></p>
              
              {(parentContent as any).heroCommitments && (parentContent as any).heroCommitments.length > 0 ? (
                <div className="flex flex-wrap gap-2.5 py-4 border-y border-gray-200">
                  {(parentContent as any).heroCommitments.map((comm: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-gray-200 shadow-sm text-xs sm:text-sm font-bold text-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      <span>{comm}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
                  {parentContent.heroIcons.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <item.icon className="w-8 h-8 text-secondary mb-2" />
                      <span className="text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: item.text }}></span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <a href="tel:0766444789" rel="nofollow" className="w-full sm:w-auto justify-center bg-primary hover:bg-sky-800 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold transition flex items-center shadow-lg text-base md:text-lg">
                  <PhoneCall className="w-5 h-5 mr-2" /> 0766 444 789
                </a>
                <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="w-full sm:w-auto justify-center bg-white border-2 border-sky-500 text-sky-600 hover:bg-sky-50 px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold transition flex items-center shadow-md text-base md:text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" /> Nhận mẫu qua Zalo
                </a>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl md:shadow-2xl relative bg-slate-100 border border-gray-100">
                {parentContent.heroImage || products[0]?.image_url ? (
                   <Image src={parentContent.heroImage || products[0].image_url} alt={categoryName} fill className="object-cover" />
                ) : (
                   <Image src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80" alt={categoryName} fill className="object-cover" />
                )}
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Cam kết</p>
                    <p className="text-sm text-gray-500">Chất lượng 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 SEO ARTICLE */}
      {parentContent.seoArticle && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="prose prose-sm md:prose-base prose-sky max-w-none text-justify">
              <div dangerouslySetInnerHTML={{ __html: parentContent.seoArticle }} />
            </div>
          </div>
        </section>
      )}

      {/* 2. SUB-CATEGORIES BLOCK */}
      {subCategoriesList.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-primary text-center mb-12 uppercase">CÁC LOẠI {categoryName}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {subCategoriesList.map((sub) => {
                return (
                  <Link key={sub.id} href={`/danh-muc/${sub.slug}`} className="group block">
                    <div className="bg-slate-100 rounded-2xl aspect-[4/5] overflow-hidden mb-4 relative shadow-sm group-hover:shadow-md transition">
                      {sub?.image_url ? (
                        <Image src={sub.image_url} alt={sub.name} fill className="object-cover group-hover:scale-110 transition duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                           <Box className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-center text-gray-800 mb-1 group-hover:text-secondary transition">{sub.name}</h3>
                    <p className="text-sm text-sky-600 text-center font-medium group-hover:underline">Xem chi tiết &rarr;</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 2B. PRODUCTS GRID */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-primary text-center mb-12 uppercase">SẢN PHẨM {categoryName}</h2>
          
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Đang cập nhật sản phẩm...</p>
          )}
          {renderPagination()}
        </div>
      </section>

      {/* 4.5 PRICING TABLE (Moved below Products) */}
      {products && products.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary text-center mb-8 uppercase">BẢNG GIÁ {categoryName}</h2>
            <div className="overflow-x-auto overflow-y-auto max-h-[450px] rounded-2xl border border-gray-200 shadow-sm relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-primary text-white">
                    <th className="p-4 font-bold border-b border-primary/20">Tên sản phẩm</th>
                    <th className="p-4 font-bold border-b border-primary/20 text-right">Đơn giá tham khảo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {products.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-semibold text-gray-800">{prod.name}</td>
                      <td className="p-4 font-bold text-secondary text-right">
                        {prod.sale_price || prod.original_price ? (
                          prod.sale_price || prod.original_price
                        ) : (
                          <a href="tel:0766444789" className="text-primary hover:underline transition">Liên hệ</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 6. MID CTA (Moved below Pricing Table) */}
      <section className="py-12 bg-sky-50 border-y border-sky-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-sky-100 gap-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">BẠN ĐANG CẦN TƯ VẤN {categoryName.toUpperCase()}?</h2>
              <p className="text-gray-600 text-lg">Gửi hình ảnh qua Zalo để được tư vấn mẫu phù hợp và nhận báo giá nhanh nhất!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a href="tel:0766444789" rel="nofollow" className="bg-primary hover:bg-sky-800 text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center shadow-lg whitespace-nowrap">
                <PhoneCall className="w-5 h-5 mr-2" /> 0766 444 789
              </a>
              <a href="https://zalo.me/0766444789" target="_blank" rel="nofollow noopener noreferrer" className="bg-sky-500 hover:bg-sky-800 text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center shadow-lg whitespace-nowrap">
                <MessageCircle className="w-5 h-5 mr-2" /> Nhắn tin Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT BENEFITS */}
      <section className="py-16 bg-slate-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl font-extrabold text-primary uppercase">VÌ SAO NÊN CHỌN {categoryName}?</h2>
              
              <div className="space-y-6">
                {parentContent.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{benefit.title}</h3>
                      <p className="text-gray-600 mt-1">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl relative">
                {products[1]?.image_url ? (
                   <Image src={products[1].image_url} alt="Lợi ích sản phẩm" fill className="object-cover" />
                ) : (
                   <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" alt="Lợi ích sản phẩm" fill className="object-cover" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPANY BENEFITS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-primary text-center mb-12 uppercase">VÌ SAO CHỌN NỘI THẤT KHÔNG GIỚI HẠN</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Award, title: 'Kinh nghiệm nhiều năm' },
              { icon: Box, title: 'Kho mẫu đa dạng' },
              { icon: PenTool, title: 'Tư vấn - thiết kế miễn phí' },
              { icon: Ruler, title: 'Đo đạc tận nơi chuyên nghiệp' },
              { icon: ShieldCheck, title: 'Bảo hành lên đến 5 năm' },
              { icon: HeartHandshake, title: 'Hỗ trợ tận tâm sau bán hàng' }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="font-bold text-sm text-gray-800">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold text-primary text-center mb-12 uppercase">CÂU HỎI THƯỜNG GẶP (FAQ)</h2>
          
          <div className="space-y-4">
            {parentContent.faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-gray-900">
                  {faq.q}
                  <span className="transition duration-300 group-open:-rotate-180">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>




      </div>
  );
}