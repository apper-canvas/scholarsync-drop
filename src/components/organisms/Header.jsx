import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';

const Header = ({ title, onMenuClick, searchValue, onSearchChange, showSearch = false }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
          >
            <ApperIcon name="Menu" className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {showSearch && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search students..."
              className="hidden md:block"
            />
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Ms. Johnson</p>
                <p className="text-xs text-gray-500">Mathematics Teacher</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">MJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;