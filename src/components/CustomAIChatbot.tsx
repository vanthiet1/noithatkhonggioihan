'use client';

import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function CustomAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Xin chào! Tôi là Trợ lý AI của Nội Thất Không Giới Hạn. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    // Thêm tin nhắn của user
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    
    // Xử lý logic từ khóa đơn giản để Chatbot trông "thông minh" hơn
    setTimeout(() => {
      let response = '';
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('tấm ốp') || lowerInput.includes('nano')) {
        response = 'Dạ, Nội Thất Không Giới Hạn là đơn vị Tổng kho phân phối và thi công Tấm Ốp Tường Nano số 1 tại Đà Nẵng.\n\n🌟 ƯU ĐIỂM VƯỢT TRỘI:\n- Chống thấm nước, chống ẩm mốc 100%, rất phù hợp với khí hậu miền Trung.\n- Bề mặt mô phỏng vân gỗ, vân đá cẩm thạch cực kỳ chân thật và sang trọng.\n- Thi công cực nhanh (ốp trực tiếp lên tường cũ, tường gạch gồ ghề không cần bả matit).\n- Tuổi thọ lên đến 20 năm, dễ dàng lau chùi bề mặt.\n\n💡 ỨNG DỤNG:\nPhù hợp ốp vách tivi phòng khách, ốp tường phòng ngủ, sảnh lễ tân, hoặc cải tạo tường cũ bị thấm mốc.\n\n👉 Bạn đang cần ốp khoảng bao nhiêu mét vuông ạ? Bạn nhắn qua Zalo 0766.444.789 để bên mình gửi catalogue mẫu vân đá/vân gỗ và báo giá ưu đãi nhé!';
      } else if (lowerInput.includes('rèm') || lowerInput.includes('màn cửa')) {
        response = 'Dạ, bên mình cung cấp và lắp đặt trọn gói Rèm Cửa Cao Cấp tại Đà Nẵng với hàng trăm mẫu mã:\n\n✨ CÁC LOẠI RÈM PHỔ BIẾN:\n- Rèm vải 2 lớp (chống nắng 100%, cản nhiệt, sang trọng cho phòng khách/phòng ngủ).\n- Rèm cầu vồng Hàn Quốc (gọn gàng, hiện đại, lấy sáng linh hoạt).\n- Rèm cuốn, rèm sáo nhôm, rèm lá dọc (phù hợp cho văn phòng).\n\n📐 BẢO HÀNH & HỖ TRỢ:\n- Bảo hành phụ kiện lên đến 2 năm.\n- Bên mình sẽ có nhân viên mang theo Catalogue vải đến tận nhà bạn đo đạc, tư vấn màu sắc hợp phong thủy và báo giá miễn phí.\n\n👉 Bạn có thể gọi Hotline hoặc Zalo 0766.444.789 để xếp lịch hẹn khảo sát nhé!';
      } else if (lowerInput.includes('muỗi') || lowerInput.includes('cửa lưới')) {
        response = 'Dạ, Cửa Lưới Chống Muỗi là giải pháp bảo vệ sức khỏe gia đình cực kỳ thiết thực ạ.\n\n🛡️ CÁC HỆ CỬA BÊN MÌNH THI CÔNG:\n- Cửa lưới hệ tự cuốn (phù hợp cửa sổ nhỏ).\n- Cửa lưới hệ xếp có ray / không ray (sang trọng, gọn gàng cho cửa đi, cửa ra ban công).\n- Lưới Inox 304 chống chuột hoặc lưới sợi thủy tinh phủ nhựa siêu bền.\n\n✨ TÍNH NĂNG:\n- Ngăn 100% ruồi muỗi, côn trùng, kiến ba khoang.\n- Đảm bảo nhà cửa luôn thoáng mát, không cần dùng hóa chất độc hại.\n\n👉 Bạn có mấy cửa cần làm ạ? Vui lòng nhắn tin Zalo 0766.444.789, bên mình sẽ tư vấn hệ cửa phù hợp nhất nhé!';
      } else if (lowerInput.includes('giấy dán') || lowerInput.includes('tranh')) {
        response = 'Dạ, Nội Thất Không Giới Hạn cung cấp kho Giấy dán tường Hàn Quốc & Tranh 3D lớn nhất Đà Nẵng.\n\n🎨 ĐẶC ĐIỂM:\n- Hàng nhập khẩu chính hãng Hàn Quốc (LG, Cosmos, Shinhan...).\n- Tranh 3D in công nghệ UV cao cấp trên nền lụa bóng, mực in sắc nét không phai.\n- Bề mặt phủ Vinyl chống bám bẩn, dễ lau chùi.\n- Có mẫu trơn, họa tiết tân cổ điển, hoa lá, hoạt hình cho bé...\n\n👉 Bạn muốn dán cho không gian nào ạ? Hãy kết bạn Zalo 0766.444.789 để nhận link thư viện hơn 10.000 mẫu đẹp nhất nhé!';
      } else if (lowerInput.includes('giá') || lowerInput.includes('bao nhiêu') || lowerInput.includes('báo giá')) {
        response = 'Dạ, vì các sản phẩm nội thất như Tấm ốp, Rèm cửa hay Cửa lưới cần được đo đạc kích thước thực tế và tùy thuộc vào mã vật liệu (loại thường hay cao cấp) thì mới tính ra giá chính xác được ạ.\n\nTuy nhiên, Nội Thất Không Giới Hạn cam kết mức giá luôn TỐT NHẤT THỊ TRƯỜNG Đà Nẵng vì bên mình nhập trực tiếp từ tổng kho, không qua trung gian.\n\n🔥 ĐẶC BIỆT: Miễn phí hoàn toàn chi phí khảo sát, đo đạc và thiết kế tận nhà.\n\n👉 Bạn vui lòng kết bạn Zalo 0766.444.789 để chuyên viên báo giá ước lượng ngay cho bạn nhé!';
      } else if (lowerInput.includes('chào') || lowerInput.includes('hello')) {
        response = 'Dạ em chào anh/chị ạ! Chào mừng anh/chị đến với Nội Thất Không Giới Hạn.\n\nBên em chuyên cung cấp và thi công các hạng mục:\n1. Tấm ốp tường Nano/PVC\n2. Rèm cửa cao cấp\n3. Cửa lưới chống muỗi\n4. Giấy dán tường & Tranh 3D\n\nAnh/chị đang có nhu cầu tìm hiểu về sản phẩm nào để em tư vấn chi tiết thông tin và báo giá ạ?';
      } else if (lowerInput.includes('địa chỉ') || lowerInput.includes('ở đâu')) {
        response = '📍 Địa chỉ văn phòng & showroom bên em tại: 180 Nguyễn Bá Loan, Hòa Xuân, TP. Đà Nẵng.\n\nBên em nhận thi công trọn gói cho toàn bộ khu vực Đà Nẵng và Quảng Nam.\n\nĐội ngũ kỹ thuật bên em luôn sẵn sàng mang mẫu mã đến tận nhà anh/chị để khảo sát đo đạc (Miễn phí 100%). Anh/chị chỉ cần gọi Hotline 0766.444.789 là bên em có mặt ạ!';
      } else {
        response = 'Dạ, cảm ơn bạn đã quan tâm đến dịch vụ của Nội Thất Không Giới Hạn. Để được nhân viên hỗ trợ chi tiết và chính xác nhất cho yêu cầu của bạn, bạn vui lòng liên hệ trực tiếp qua Zalo hoặc Hotline 0766.444.789 nhé! Khảo sát tận nhà là hoàn toàn miễn phí ạ.';
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1200);
  };

  return (
    <>
      {/* Nút bấm AI Floating */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[160px] right-6 z-50 bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-3 px-5 rounded-full shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center group animate-bounce ${isOpen ? 'hidden' : 'flex'}`}
        style={{ animationDuration: '3.5s', animationDelay: '1s' }}
      >
        <Bot className="w-6 h-6 mr-2" />
        <span className="font-bold">Chat AI</span>
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Tư vấn nội thất tự động
        </span>
      </button>

      {/* Cửa sổ Chat AI */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[350px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md z-10 relative">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm shadow-inner">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Trợ lý AI Thông Minh</h3>
                <p className="text-xs text-sky-100 flex items-center">
                  <span className="w-2 h-2 bg-sky-400 rounded-full mr-1.5 animate-pulse"></span>
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-[350px] p-4 overflow-y-auto bg-[#f8fafc] flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-sky-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center bg-gray-50 rounded-full p-1.5 border border-gray-200 shadow-sm focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi AI về rèm cửa, giấy dán tường..." 
                className="flex-grow bg-transparent outline-none px-4 text-sm text-gray-700"
              />
              <button 
                onClick={handleSend}
                className="bg-sky-600 hover:bg-indigo-600 text-white p-2.5 rounded-full transition shadow-md"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-3 text-[10px] text-gray-400 font-medium">
              Powered by Advanced AI
            </div>
          </div>
        </div>
      )}
    </>
  );
}
