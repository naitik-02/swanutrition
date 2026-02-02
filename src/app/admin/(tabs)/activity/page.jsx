"use client"

import React, { useEffect, useState } from 'react';
import { useActivity } from '@/context/activity';
import { 
  Activity, 
  User, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Shield,
  Mail,
  UserCheck,
  Calendar,
  Filter
} from 'lucide-react';
import Loading from '@/components/loading';

const ActivityLogPage = () => {
  const { activities, pagination, loading, fetchActivities } = useActivity();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchActivities({ page: 1, limit: itemsPerPage, startDate, endDate });
  }, [itemsPerPage, startDate, endDate]);

  const handlePageChange = (newPage) => {
    fetchActivities({ page: newPage, limit: itemsPerPage, startDate, endDate });
  };

  const handleRefresh = () => {
    fetchActivities({ page: pagination.page, limit: itemsPerPage, startDate, endDate });
  };

  const handleDateFilter = () => {
    fetchActivities({ page: 1, limit: itemsPerPage, startDate, endDate });
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const getActionIcon = (action) => {
    const iconMap = {
      'login': <UserCheck className="w-4 h-4" />,
      'create': <Activity className="w-4 h-4" />,
      'update': <RefreshCw className="w-4 h-4" />,
      'delete': <Shield className="w-4 h-4" />,
      'view': <Activity className="w-4 h-4" />,
    };
    return iconMap[action.toLowerCase()] || <Activity className="w-4 h-4" />;
  };

  const getActionColor = (action) => {
    const colorMap = {
      'login': 'text-green-600 bg-green-50',
      'create': 'text-blue-600 bg-blue-50',
      'update': 'text-yellow-600 bg-yellow-50',
      'delete': 'text-red-600 bg-red-50',
      'view': 'text-gray-600 bg-gray-50',
    };
    return colorMap[action.toLowerCase()] || 'text-gray-600 bg-gray-50';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'bg-purple-100 text-purple-800',
      'manager': 'bg-blue-100 text-blue-800',
      'user': 'bg-green-100 text-green-800',
      'guest': 'bg-gray-100 text-gray-800',
    };
    return roleColors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          </div>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Date Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <label className="text-sm text-gray-600 whitespace-nowrap">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <label className="text-sm text-gray-600 whitespace-nowrap">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDateFilter}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    Apply
                  </button>
                  
                  {(startDate || endDate) && (
                    <button
                      onClick={clearDateFilter}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Items per page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
           <Loading />
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table Header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 min-w-[120px]">Action</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 min-w-[250px]">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 min-w-[200px]">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 min-w-[100px]">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 min-w-[120px]">Time</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200">
                    {activities.map((activity, index) => (
                      <tr key={activity._id || index} className="hover:bg-gray-50 transition-colors">
                        {/* Action */}
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getActionColor(activity.action)}`}>
                            {getActionIcon(activity.action)}
                            <span className="capitalize whitespace-nowrap">{activity.action}</span>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4">
                          <p className="text-gray-900 text-sm leading-relaxed break-words">
                            {activity.description || 'No description available'}
                          </p>
                        </td>

                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-sm break-words">
                                {activity.user?.name || 'Unknown User'}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="break-all">{activity.user?.email || 'No email'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRoleColor(activity.user?.role)}`}>
                            {activity.user?.role || 'No role'}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">{formatDate(activity.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && activities.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination.page - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * itemsPerPage, pagination.total)}
              </span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        pageNum === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;