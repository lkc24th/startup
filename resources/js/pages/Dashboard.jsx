import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Appointments from '../components/Appointments';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('services');
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={auth.user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Chào mừng, {auth.user.username}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {auth.user.role === 'admin' ? 'Quản lý salon của bạn' : 'Đặt lịch hẹn làm móng'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-6 font-medium border-b-2 transition ${
              activeTab === 'services'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Dịch vụ
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-4 px-6 font-medium border-b-2 transition ${
              activeTab === 'appointments'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📅 Lịch hẹn
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'services' && <Services token={auth.token} />}
          {activeTab === 'appointments' && <Appointments token={auth.token} userId={auth.user.id} />}
        </div>
      </div>
    </div>
  );
}
