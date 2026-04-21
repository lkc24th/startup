import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl">💅</span>
            <span className="ml-2 font-bold text-xl text-pink-600">Nail Salon</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">{user.username}</span>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
