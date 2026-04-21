import React, { useState, useEffect } from 'react';
import { appointmentsAPI, servicesAPI } from '../services/api';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (filterStatus = null) => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getByDateRange(startDate, endDate);

      let data = response.data.data;
      
      if (filterStatus) {
        data = data.filter(apt => apt.status === filterStatus);
      }

      setAppointments(data);
    } catch (err) {
      setError('Lỗi khi tải lịch hẹn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchAppointments(status);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await appointmentsAPI.updateStatus(id, newStatus);
      if (response.data.success) {
        setAppointments(appointments.map(apt =>
          apt.id === id ? { ...apt, status: newStatus } : apt
        ));
        setEditingId(null);
        alert('Trạng thái lịch hẹn được cập nhật');
      }
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleConfirm = async (id) => {
    await handleStatusChange(id, 'confirmed');
  };

  const handleReject = async (id) => {
    await handleStatusChange(id, 'rejected');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận' },
      'in-process': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đang thực hiện' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn thành' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Từ chối' },
      'no-show': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Không tới' }
    };
    const current = statusMap[status] || statusMap['pending'];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${current.bg} ${current.text}`}>
        {current.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản Lý Lịch Hẹn</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ Ngày</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến Ngày</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">-- Tất Cả --</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="in-process">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="no-show">Không tới</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Tải...' : 'Lọc'}
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Khách Hàng</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SĐT</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày/Giờ</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thợ</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dịch Vụ</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tiền</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Không có lịch hẹn nào
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{apt.user?.name}</p>
                          <p className="text-sm text-gray-500">{apt.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-900">{apt.user?.phone}</td>
                      <td className="px-6 py-3 text-gray-900">
                        {new Date(apt.appointment_date).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-3 text-gray-900">{apt.staff?.name}</td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {apt.services?.map((srv) => (
                            <span key={srv.id} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                              {srv.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-semibold text-pink-600">
                        {parseFloat(apt.total_price).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-6 py-3">
                        {editingId === apt.id ? (
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value)}
                            onBlur={() => {
                              if (editingStatus) {
                                handleStatusChange(apt.id, editingStatus);
                              }
                              setEditingId(null);
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            autoFocus
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="in-process">Đang thực hiện</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                            <option value="no-show">Không tới</option>
                          </select>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingId(apt.id);
                              setEditingStatus(apt.status);
                            }}
                            className="cursor-pointer"
                          >
                            {getStatusBadge(apt.status)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-1">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleConfirm(apt.id)}
                                className="text-xs bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded transition-colors"
                              >
                                Xác Nhận
                              </button>
                              <button
                                onClick={() => handleReject(apt.id)}
                                className="text-xs bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1 rounded transition-colors"
                              >
                                Từ Chối
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
