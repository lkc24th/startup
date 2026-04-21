import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white mb-8">Trang không tìm thấy</p>
        <Link to="/" className="bg-white text-pink-600 font-bold py-3 px-6 rounded-lg hover:shadow-lg transition">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
