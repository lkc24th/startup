import React, { useState, useEffect } from 'react';
import { servicesAPI, appointmentsAPI } from '../services/api';
import { Staff } from '../models/Staff';

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    staff_id: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const servicesRes = await servicesAPI.getAll();
      if (servicesRes.data.success) {
        setServices(servicesRes.data.data);
      }
      // Placeholder for staff - you'll need to create a Staff API endpoint
      const mockStaff = [
        { id: 1, name: 'Thương' },
        { id: 2, name: 'Hương' },
        { id: 3, name: 'Linh' }
      ];
      setStaff(mockStaff);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
    }
  };

  const handleServiceToggle = (serviceId) => {
    const newSelected = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(newSelected);

    // Calculate total price
    const selectedServiceObjects = services.filter(s => newSelected.includes(s.id));
    const total = selectedServiceObjects.reduce((sum, s) => sum + parseFloat(s.price), 0);
    setTotalPrice(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      setError('Vui lòng chọn ít nhất một dịch vụ');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Combine date and time
      const appointmentDateTime = `${formData.appointment_date} ${formData.appointment_time}`;

      const response = await appointmentsAPI.create({
        name: formData.name,
        phone: formData.phone,
        appointment_date: appointmentDateTime,
        staff_id: formData.staff_id,
        services: selectedServices,
        notes: formData.notes
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          appointment_date: '',
          appointment_time: '',
          staff_id: '',
          notes: ''
        });
        setSelectedServices([]);
        setTotalPrice(0);

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Đặt Lịch Hẹn</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ Lịch hẹn của bạn đã được tạo thành công! Chúng tôi sẽ liên hệ xác nhận trong 24 giờ.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Của Bạn</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>

          {/* Services Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn Dịch Vụ *</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`service-${service.id}`} className="ml-3 flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </label>
                  <div className="text-right">
                    <div className="font-semibold text-pink-600">{parseFloat(service.price).toLocaleString('vi-VN')} ₫</div>
                    <div className="text-sm text-gray-500">{service.duration} phút</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi Tiết Lịch Hẹn</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ *</label>
                <input
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Thợ *</label>
                <select
                  name="staff_id"
                  value={formData.staff_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">-- Chọn thợ --</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi Chú (mẫu nail, yêu cầu đặc biệt...)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Nhập ghi chú của bạn..."
            />
          </div>

          {/* Total Price */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Tổng Tiền:</span>
              <span className="text-2xl text-pink-600">{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Lịch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
