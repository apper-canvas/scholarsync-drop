import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import studentService from '@/services/api/studentService';
import classService from '@/services/api/classService';
import attendanceService from '@/services/api/attendanceService';
import gradeService from '@/services/api/gradeService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageAttendance: 0,
    averageGPA: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [students, classes, attendance, grades] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      // Calculate statistics
      const totalStudents = students.length;
      const totalClasses = classes.length;
      
      // Calculate average attendance
      const presentCount = attendance.filter(record => record.status === 'present').length;
      const averageAttendance = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
      
      // Calculate average GPA (simplified)
      const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0);
      const averageScore = grades.length > 0 ? totalGrades / grades.length : 0;
      const averageGPA = (averageScore / 100) * 4; // Convert to 4.0 scale

      setStats({
        totalStudents,
        totalClasses,
        averageAttendance,
        averageGPA: averageGPA.toFixed(1)
      });

      // Generate recent activity
      const activities = [
        { id: 1, type: 'grade', message: 'New assignment grades added for Mathematics', time: '2 hours ago', icon: 'BookOpen' },
        { id: 2, type: 'attendance', message: 'Attendance marked for Physics Class', time: '4 hours ago', icon: 'Calendar' },
        { id: 3, type: 'student', message: 'New student enrolled: Sarah Wilson', time: '1 day ago', icon: 'UserPlus' },
        { id: 4, type: 'class', message: 'Chemistry lab session scheduled', time: '2 days ago', icon: 'Clock' }
      ];

      setRecentActivity(activities);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading />
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 font-display">
              Welcome back, Ms. Johnson!
            </h1>
            <p className="text-primary-100">
              Here's what's happening with your classes today.
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="Sun" className="h-16 w-16 text-primary-200" />
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+5 this month"
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses}
          icon="BookOpen"
          color="secondary"
          trend="up"
          trendValue="+2 this semester"
        />
        <StatCard
          title="Average Attendance"
          value={`${stats.averageAttendance}%`}
          icon="Calendar"
          color="success"
          trend="up"
          trendValue="+3% this week"
        />
        <StatCard
          title="Class Average GPA"
          value={stats.averageGPA}
          icon="Award"
          color="accent"
          trend="up"
          trendValue="+0.2 this quarter"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Today's Schedule
            </h2>
            <ApperIcon name="Clock" className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {[
              { time: '9:00 AM', class: 'Mathematics - Room 201', students: 28 },
              { time: '11:00 AM', class: 'Physics - Lab 3', students: 24 },
              { time: '2:00 PM', class: 'Chemistry - Room 105', students: 22 },
              { time: '3:30 PM', class: 'Study Hall - Library', students: 15 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.class}</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {item.students} students
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Recent Activity
            </h2>
            <ApperIcon name="Activity" className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <ApperIcon name={activity.icon} className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Mark Attendance', icon: 'Calendar', color: 'bg-green-500' },
            { label: 'Enter Grades', icon: 'BookOpen', color: 'bg-blue-500' },
            { label: 'Add Student', icon: 'UserPlus', color: 'bg-purple-500' },
            { label: 'Create Assignment', icon: 'FileText', color: 'bg-orange-500' }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-150 hover:shadow-md"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                <ApperIcon name={action.icon} className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;