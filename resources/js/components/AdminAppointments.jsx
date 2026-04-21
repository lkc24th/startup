import React, { useState, useEffect } from 'react';

const API_BASE_URL = window.location.port === '5173'
  ? 'http://localhost:8000'
  : window.location.origin;

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      console.log('📥 Fetching appointments from:', `${API_BASE_URL}/api/appointments`);
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📊 API Response:', { status: response.status, data });
      
      if (response.ok) {
        let filtered = data.data || [];
        console.log('📋 Total appointments:', filtered.length);
        
        // Log first appointment structure for debugging
        if (filtered.length > 0) {
          console.log('📌 Sample appointment structure:', filtered[0]);
        }
        
        if (filter !== 'all') {
          filtered = filtered.filter(a => a.status === filter);
        }
        setAppointments(filtered);
      } else {
        console.error('❌ API Error:', data.message);
        alert(`❌ Lỗi: ${data.message || 'Không thể tải lịch hẹn'}`);
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      alert('Lỗi kết nối khi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    setActionInProgress(`${id}-${action}`);
    try {
      const endpointMap = {
        'confirmed': 'confirm',
        'rejected': 'reject',
        'cancelled': 'cancel'
      };
      
      const endpoint = endpointMap[action] || action;
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/${id}/${endpoint}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        alert('✓ Cập nhật thành công');
        fetchAppointments();
      } else {
        const errorData = await response.json();
        alert(`✕ Lỗi: ${errorData.message || 'Không thể cập nhật'}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Lỗi kết nối');
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-orange-100 text-orange-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': '⏳ Chờ xác nhận',
      'confirmed': '✓ Đã xác nhận',
      'rejected': '✕ Đã từ chối',
      'cancelled': '✖ Đã hủy',
      'completed': '✓ Hoàn thành',
      'no-show': 'Vắng mặt'
    };
    return labels[status] || status;
  };

  const getCustomerName = (appointment) => {
    // Try to get name from user relationship
    if (appointment.user?.name) return appointment.user.name;
    if (appointment.user?.username) return appointment.user.username;
    // Fallback to appointment.name if it exists (old format)
    if (appointment.name) return appointment.name;
    return 'N/A';
  };

  const getCustomerPhone = (appointment) => {
    if (appointment.user?.phone) return appointment.user.phone;
    if (appointment.phone) return appointment.phone;
    return 'N/A';
  };

  const getServiceNames = (appointment) => {
    if (appointment.services && Array.isArray(appointment.services)) {
      return appointment.services.map(s => s.name || s).join(', ');
    }
    return 'N/A';
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'Tất cả' : status === 'pending' ? '⏳ Chờ xác nhận' : status}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Không có lịch hẹn</div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{getCustomerName(appointment)}</h3>
                  <p className="text-gray-600 text-sm">📱 {getCustomerPhone(appointment)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">📅 Ngày giờ</p>
                  <p className="font-medium">{new Date(appointment.appointment_date).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">💰 Tổng tiền</p>
                  <p className="font-medium text-pink-600">{appointment.total_price?.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-gray-600 text-sm">🛎️ Dịch vụ</p>
                <p className="font-medium">{getServiceNames(appointment)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(appointment.id, 'confirmed')}
                      disabled={actionInProgress?.startsWith(appointment.id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {actionInProgress === `${appointment.id}-confirmed` ? '⏳...' : '✓ Xác nhận'}
                    </button>
                    <button
                      onClick={() => updateStatus(appointment.id, 'rejected')}
                      disabled={actionInProgress?.startsWith(appointment.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {actionInProgress === `${appointment.id}-rejected` ? '⏳...' : '✕ Từ chối'}
                    </button>
                  </>
                )}
                
                {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                  <button
                    onClick={() => {
                      if (confirm('Bạn chắc chắn muốn hủy lịch hẹn này?')) {
                        updateStatus(appointment.id, 'cancelled');
                      }
                    }}
                    disabled={actionInProgress?.startsWith(appointment.id)}
                    className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50 transition"
                  >
                    {actionInProgress === `${appointment.id}-cancelled` ? '⏳...' : '✖ Hủy'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">📅 Ngày giờ</p>
                  <p className="font-medium">{new Date(appointment.appointment_date).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">💰 Tổng tiền</p>
                  <p className="font-medium text-pink-600">{appointment.total_price?.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>

              {appointment.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(appointment.id, 'confirmed')}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    ✓ Xác nhận
                  </button>
                  <button
                    onClick={() => updateStatus(appointment.id, 'rejected')}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    ✕ Từ chối
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
