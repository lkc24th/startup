import React, { useState, useEffect } from 'react';

export default function Services({ token }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.length === 0 ? (
        <div className="col-span-3 text-center py-8 text-gray-500">
          Không có dịch vụ nào
        </div>
      ) : (
        services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
            {service.image && (
              <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-pink-600 font-bold text-lg">
                  {service.price?.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-gray-500 text-sm">⏱ {service.duration} phút</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
