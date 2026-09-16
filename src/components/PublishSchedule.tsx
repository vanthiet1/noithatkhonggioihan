'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface PublishScheduleProps {
  initialStatus?: 'draft' | 'published';
  initialPublishedAt?: string | null;
}

export default function PublishSchedule({
  initialStatus = 'published',
  initialPublishedAt = null
}: PublishScheduleProps) {
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  
  // Date and Time states
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    if (initialPublishedAt) {
      const pubDate = new Date(initialPublishedAt);
      const now = new Date();
      // If it's a future date, set as scheduled
      if (pubDate > now) {
        setIsScheduled(true);
        // Format YYYY-MM-DD for date input
        const yyyy = pubDate.getFullYear();
        const mm = String(pubDate.getMonth() + 1).padStart(2, '0');
        const dd = String(pubDate.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
        
        // Format HH:MM for time input
        const hours = String(pubDate.getHours()).padStart(2, '0');
        const minutes = String(pubDate.getMinutes()).padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      }
    }
  }, [initialPublishedAt]);

  const handleModeChange = (mode: 'immediate' | 'schedule') => {
    if (mode === 'immediate') {
      setIsScheduled(false);
      setDate('');
      setTime('');
    } else {
      setIsScheduled(true);
      // Default to tomorrow 08:00 AM if enabling schedule
      if (!date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
      }
      if (!time) {
        setTime('08:00');
      }
    }
  };

  // Compute final ISO string to submit to backend
  let finalPublishedAt = '';
  if (isScheduled && date && time) {
    const dateTimeObj = new Date(`${date}T${time}:00`);
    finalPublishedAt = dateTimeObj.toISOString();
  } else {
    // If immediate, pass empty string so backend uses NOW() or just keep it empty
    finalPublishedAt = new Date().toISOString();
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Đăng bài</h3>
      
      {/* Hidden inputs to be picked up by the form submission (FormData) */}
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="published_at" value={finalPublishedAt} />

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Trạng thái bài viết</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="status_radio" 
                value="published" 
                checked={status === 'published'} 
                onChange={() => setStatus('published')}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="text-sm text-gray-700">Công khai</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="status_radio" 
                value="draft" 
                checked={status === 'draft'} 
                onChange={() => setStatus('draft')}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="text-sm text-gray-700">Bản nháp (Ẩn)</span>
            </label>
          </div>
        </div>

        {status === 'published' && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700">Thời gian đăng bài</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="schedule_mode" 
                  checked={!isScheduled} 
                  onChange={() => handleModeChange('immediate')}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm text-gray-700">Ngay lập tức</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="schedule_mode" 
                  checked={isScheduled} 
                  onChange={() => handleModeChange('schedule')}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm text-gray-700">Lên lịch (Hẹn giờ)</span>
              </label>
            </div>

            {isScheduled && (
              <div className="flex items-center gap-3 mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Ngày đăng</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Giờ đăng</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
