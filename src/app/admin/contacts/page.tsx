import { createClient } from '@/utils/supabase/server';
import { Users, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { updateContactStatus, deleteContact } from '@/app/actions/admin';

export default async function AdminContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  const total = contacts?.length || 0;
  const pending = contacts?.filter(c => c.status === 'pending').length || 0;
  const done = contacts?.filter(c => c.status === 'done').length || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Liên hệ</h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách các yêu cầu liên hệ từ khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Tổng liên hệ</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mr-4">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chờ xử lý</p>
            <p className="text-2xl font-bold text-orange-600">{pending}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Đã xử lý</p>
            <p className="text-2xl font-bold text-sky-600">{done}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Họ tên</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Điện thoại</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tin nhắn</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Thời gian</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts && contacts.length > 0 ? contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{contact.name}</td>
                <td className="px-6 py-4">
                  <a href={`tel:${contact.phone}`} className="text-primary hover:underline font-medium">{contact.phone}</a>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate text-sm">{contact.message || '—'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                  {new Date(contact.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${contact.status === 'done' ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'}`}>
                    {contact.status === 'done' ? 'Đã xử lý' : 'Chờ xử lý'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <form action={async () => {
                      'use server';
                      await updateContactStatus(contact.id, contact.status === 'done' ? 'pending' : 'done');
                    }}>
                      <button type="submit" className={`text-xs px-3 py-1 rounded-lg font-medium transition ${contact.status === 'done' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>
                        {contact.status === 'done' ? 'Mở lại' : 'Xong'}
                      </button>
                    </form>
                    <form action={async () => {
                      'use server';
                      await deleteContact(contact.id);
                    }}>
                      <button type="submit" className="text-xs px-3 py-1 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">
                        Xóa
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Chưa có liên hệ nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
