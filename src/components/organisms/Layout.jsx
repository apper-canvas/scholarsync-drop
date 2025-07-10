import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/students':
        return 'Students';
      case '/classes':
        return 'Classes';
      case '/grades':
        return 'Grades';
      case '/attendance':
        return 'Attendance';
      default:
        return 'ScholarSync';
    }
  };

  const showSearch = location.pathname === '/students';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:ml-64">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={(e) => setSearchValue(e.target.value)}
          showSearch={showSearch}
/>
        
        <main className="p-3 lg:p-4">
          <Outlet context={{ searchValue }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;