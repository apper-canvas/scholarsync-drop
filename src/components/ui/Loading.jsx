import React from 'react';

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded shimmer w-48"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="px-6 py-4 flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded shimmer w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded shimmer w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded shimmer w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded shimmer w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;