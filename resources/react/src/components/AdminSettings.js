import React, { useState, useEffect } from 'react';
import { salonSettingsAPI } from '../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    salon_name: '',
    salon_address: '',
    salon_phone: '',
    salon_email: '',
    slot_duration: 60,
    max_concurrent_staff: 5,
    booking_advance_days: 30,
    cancel_before_hours: 24
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '08:00', close: '20:00', closed: false },
    sunday: { open: '09:00', close: '18:00', closed: true }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await salonSettingsAPI.getAll();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleWorkingHourChange = (day, field, value) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const response = await salonSettingsAPI.update({
        ...settings,
        working_hours: workingHours
      });

      if (response.data.success) {
        setSuccess('Cài đặt được cập nhật thành công');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const days = [
    { key: 'monday', label: 'Thứ Hai' },
    { key: 'tuesday', label: 'Thứ Ba' },
    { key: 'wednesday', label: 'Thứ Tư' },
    { key: 'thursday', label: 'Thứ Năm' },
    { key: 'friday', label: 'Thứ Sáu' },
    { key: 'saturday', label: 'Thứ Bảy' },
    { key: 'sunday', label: 'Chủ Nhật' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cài Đặt Quán</h1>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Salon Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Quán</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Quán</label>
                <input
                  type="text"
                  value={settings.salon_name}
                  onChange={(e) => handleSettingChange('salon_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ</label>
                <input
                  type="text"
                  value={settings.salon_address}
                  onChange={(e) => handleSettingChange('salon_address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={settings.salon_phone}
                    onChange={(e) => handleSettingChange('salon_phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.salon_email}
                    onChange={(e) => handleSettingChange('salon_email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Operation Settings */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt Hoạt Động</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời Lượng Mỗi Slot (phút)
                </label>
                <input
                  type="number"
                  value={settings.slot_duration}
                  onChange={(e) => handleSettingChange('slot_duration', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Thợ Phục Vụ Tối Đa
                </label>
                <input
                  type="number"
                  value={settings.max_concurrent_staff}
                  onChange={(e) => handleSettingChange('max_concurrent_staff', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Ngày Có Thể Đặt Trước (ngày)
                </label>
                <input
                  type="number"
                  value={settings.booking_advance_days}
                  onChange={(e) => handleSettingChange('booking_advance_days', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cho Phép Hủy Trước (giờ)
                </label>
                <input
                  type="number"
                  value={settings.cancel_before_hours}
                  onChange={(e) => handleSettingChange('cancel_before_hours', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Giờ Làm Việc</h2>
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day.key} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border border-gray-200 rounded-lg">
                  <div className="font-semibold text-gray-900">{day.label}</div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mở Cửa</label>
                    <input
                      type="time"
                      value={workingHours[day.key].open}
                      onChange={(e) => handleWorkingHourChange(day.key, 'open', e.target.value)}
                      disabled={workingHours[day.key].closed}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Đóng Cửa</label>
                    <input
                      type="time"
                      value={workingHours[day.key].close}
                      onChange={(e) => handleWorkingHourChange(day.key, 'close', e.target.value)}
                      disabled={workingHours[day.key].closed}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={workingHours[day.key].closed}
                      onChange={(e) => handleWorkingHourChange(day.key, 'closed', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Nghỉ</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Đang lưu...' : 'Lưu Cài Đặt'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
