import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Zalo Button */}
      <a 
        href="https://zalo.me/0766444789" 
        target="_blank" 
        rel="nofollow noopener noreferrer"
        className="relative group w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat Zalo
        </span>
        <MessageCircle className="text-white w-7 h-7" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
      </a>

      {/* Phone Button */}
      <a 
        href="tel:+84766444789" 
        rel="nofollow" 
        className="relative group w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
        style={{ animationDuration: '3.2s', animationDelay: '0.5s' }}
      >
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Gọi ngay: 0766.444.789
        </span>
        <Phone className="text-white w-7 h-7" />
        <div className="absolute inset-0 rounded-full border-4 border-sky-500 animate-ping opacity-50"></div>
      </a>
    </div>
  );
}
