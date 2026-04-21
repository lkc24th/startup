import React, { useState, useEffect } from 'react';
import { servicesAPI, salonSettingsAPI } from '../services/api';

const CustomerHome = () => {
  const [services, setServices] = useState([]);
  const [salonInfo, setSalonInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, settingsRes] = await Promise.all([
        servicesAPI.getAll(),
        salonSettingsAPI.getPublic()
      ]);

      if (servicesRes.data.success) {
        setServices(servicesRes.data.data);
      }
      if (settingsRes.data.success) {
        setSalonInfo(settingsRes.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Salon Info Section */}
      {salonInfo && (
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-900">{salonInfo.salon_name}</h1>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
              <div>
                <span className="font-semibold">📍 Địa chỉ:</span> {salonInfo.salon_address}
              </div>
              <div>
                <span className="font-semibold">📞 Điện thoại:</span> {salonInfo.salon_phone}
              </div>
              <div>
                <span className="font-semibold">⏰ Khoảng khung:</span> {salonInfo.slot_duration} phút
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Danh Sách Dịch Vụ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {service.image && (
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-600">{parseFloat(service.price).toLocaleString('vi-VN')} ₫</span>
                  <span className="text-sm text-gray-500">{service.duration} phút</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
