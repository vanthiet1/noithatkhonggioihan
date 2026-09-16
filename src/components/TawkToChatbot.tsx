'use client';

import { useEffect } from 'react';

export default function TawkToChatbot() {
  useEffect(() => {
    // Tawk.to Script
    // Hướng dẫn: Đăng ký tại https://tawk.to, chọn tính năng AI Assist (Miễn phí)
    // Sau đó thay thế PROPERTY_ID và WIDGET_ID bằng mã của bạn.
    
    // Đang sử dụng mã demo, hãy thay bằng mã thật của bạn
    const PROPERTY_ID = 'YOUR_PROPERTY_ID_HERE'; 
    const WIDGET_ID = 'YOUR_WIDGET_ID_HERE';

    if (PROPERTY_ID === 'YOUR_PROPERTY_ID_HERE') {
        console.warn('Tawk.to: Vui lòng thay thế PROPERTY_ID bằng mã thật của bạn để Chatbot AI hoạt động.');
        return; // Không load nếu chưa có mã thật
    }

    var Tawk_API: any = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    })();
  }, []);

  return null;
}
