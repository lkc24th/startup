import React, { useState } from 'react';

export default function AdminHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Tổng lịch hẹn', value: '0', color: 'bg-blue-100 text-blue-800' },
        { label: 'Lịch hẹn hôm nay', value: '0', color: 'bg-green-100 text-green-800' },
        { label: 'Khách hàng', value: '0', color: 'bg-purple-100 text-purple-800' },
        { label: 'Doanh thu', value: '0 đ', color: 'bg-pink-100 text-pink-800' },
      ].map((stat, idx) => (
        <div key={idx} className={`${stat.color} rounded-lg p-6 shadow-md`}>
          <p className="text-sm font-medium opacity-80">{stat.label}</p>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
