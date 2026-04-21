import React, { useState, useEffect } from 'react';
import { customersAPI, appointmentsAPI } from '../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll(currentPage, 15);
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await customersAPI.search(searchQuery);
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tìm kiếm');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customerId) => {
    try {
      setLoading(true);
      const response = await customersAPI.get(customerId);
      if (response.data.success) {
        setSelectedCustomer(customerId);
        setCustomerDetails(response.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải chi tiết khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận' },
      'in-process': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đang thực hiện' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn thành' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' },
      'no-show': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Không tới' }
    };
    const current = statusMap[status] || statusMap['pending'];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${current.bg} ${current.text}`}>
        {current.label}
      </span>
    );
  };

  if (selectedCustomer && customerDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setCustomerDetails(null);
            }}
            className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Quay Lại
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Info */}
            <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông Tin Khách Hàng</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tên</p>
                  <p className="font-semibold text-gray-900">{customerDetails.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{customerDetails.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số Điện Thoại</p>
                  <p className="font-semibold text-gray-900">{customerDetails.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng Lần Đặt Lịch</p>
                  <p className="font-semibold text-gray-900">{customerDetails.total_appointments}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng Chi Tiêu</p>
                  <p className="font-semibold text-pink-600 text-lg">
                    {parseFloat(customerDetails.total_spent).toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </div>
            </div>

            {/* Appointments History */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lịch Sử Đặt Lịch</h2>
              
              {customerDetails.appointments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Không có lịch hẹn nào</p>
              ) : (
                <div className="space-y-4">
                  {customerDetails.appointments.map((apt) => (
                    <div key={apt.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(apt.appointment_date).toLocaleString('vi-VN')}
                          </p>
                          <p className="text-sm text-gray-500">Thợ: {apt.staff?.name}</p>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {apt.services?.map((srv) => (
                          <span key={srv.id} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                            {srv.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-right font-semibold text-pink-600">
                        {parseFloat(apt.total_price).toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản Lý Khách Hàng</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Tìm...' : 'Tìm Kiếm'}
            </button>
          </div>
        </form>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SĐT</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lần Đặt</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tổng Chi Tiêu</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Không có khách hàng nào
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-3 text-gray-600">{customer.email}</td>
                      <td className="px-6 py-3 text-gray-900">{customer.phone}</td>
                      <td className="px-6 py-3 text-gray-900 text-center">-</td>
                      <td className="px-6 py-3 text-pink-600 font-semibold">-</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Xem Chi Tiết
                        </button>
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

export default AdminCustomers;
