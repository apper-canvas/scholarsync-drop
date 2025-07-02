import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import AttendanceCell from '@/components/molecules/AttendanceCell';
import ApperIcon from '@/components/ApperIcon';
import attendanceService from '@/services/api/attendanceService';
import studentService from '@/services/api/studentService';
import classService from '@/services/api/classService';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuickMark, setShowQuickMark] = useState(false);

  const statusOptions = [
    { value: 'present', label: 'Present', color: 'text-green-600', icon: 'CheckCircle' },
    { value: 'absent', label: 'Absent', color: 'text-red-600', icon: 'XCircle' },
    { value: 'tardy', label: 'Tardy', color: 'text-yellow-600', icon: 'Clock' },
    { value: 'excused', label: 'Excused', color: 'text-blue-600', icon: 'Shield' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [classesData, studentsData, attendanceData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
      setAttendance(attendanceData);
      
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0].Id.toString());
      }
    } catch (err) {
      setError('Failed to load attendance data. Please try again.');
      console.error('Attendance loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCurrentClassStudents = () => {
    if (!selectedClass) return [];
    
    const currentClass = classes.find(c => c.Id.toString() === selectedClass);
    if (!currentClass || !currentClass.studentIds) return [];
    
    return students.filter(student => currentClass.studentIds.includes(student.Id));
  };

  const getAttendanceRecord = (studentId, date) => {
    return attendance.find(record => 
      record.studentId === studentId && 
      record.date === date && 
      record.classId.toString() === selectedClass
    );
  };

  const handleAttendanceChange = async (studentId, date, status) => {
    try {
      const existingRecord = getAttendanceRecord(studentId, date);
      const attendanceData = {
        studentId,
        classId: parseInt(selectedClass),
        date,
        status,
        reason: status === 'excused' ? 'Teacher approved' : ''
      };
      
      if (existingRecord) {
        await attendanceService.update(existingRecord.Id, attendanceData);
      } else {
        await attendanceService.create(attendanceData);
      }
      
      await loadData();
      toast.success(`Attendance updated for ${date}`);
    } catch (err) {
      toast.error('Failed to update attendance. Please try again.');
      console.error('Attendance update error:', err);
    }
  };

  const handleQuickMarkAll = async (status) => {
    if (!selectedClass || !selectedDate) return;
    
    try {
      const classStudents = getCurrentClassStudents();
      const promises = classStudents.map(student => 
        handleAttendanceChange(student.Id, selectedDate, status)
      );
      
      await Promise.all(promises);
      toast.success(`Marked all students as ${status} for ${selectedDate}`);
      setShowQuickMark(false);
    } catch (err) {
      toast.error('Failed to mark attendance for all students.');
    }
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getAttendanceStats = (studentId) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    const monthAttendance = attendance.filter(record => 
      record.studentId === studentId &&
      record.classId.toString() === selectedClass &&
      new Date(record.date) >= monthStart &&
      new Date(record.date) <= monthEnd
    );
    
    const present = monthAttendance.filter(record => record.status === 'present').length;
    const total = monthAttendance.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, total, percentage };
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (classes.length === 0) {
    return (
      <Empty
        title="No classes available"
        description="Create classes first to start tracking attendance."
        icon="BookOpen"
      />
    );
  }

  const classStudents = getCurrentClassStudents();
  const monthDays = getMonthDays();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Select
            label="Select Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={classes.map(c => ({ value: c.Id.toString(), label: `${c.name} - ${c.subject}` }))}
            placeholder="Choose a class"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Mark Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowQuickMark(true)}
            variant="outline"
            icon="Users"
            disabled={!selectedClass || !selectedDate}
          >
            Quick Mark All
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
            />
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              variant="ghost"
              size="sm"
              icon="ChevronRight"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {!selectedClass ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <Empty
            title="Select a class"
            description="Choose a class from the dropdown to view and manage attendance."
            icon="Calendar"
          />
        </div>
      ) : classStudents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <Empty
            title="No students enrolled"
            description="This class doesn't have any students enrolled yet."
            icon="Users"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Attendance - {classes.find(c => c.Id.toString() === selectedClass)?.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                {statusOptions.map(status => (
                  <div key={status.value} className="flex items-center space-x-1">
                    <ApperIcon name={status.icon} size={16} className={status.color} />
                    <span className="capitalize">{status.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Student
                  </th>
                  {monthDays.slice(0, 15).map(day => (
                    <th key={day.toISOString()} className={`px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px] ${isToday(day) ? 'bg-primary-50' : ''}`}>
                      <div>
                        <div className="font-semibold">{format(day, 'd')}</div>
                        <div className="text-xs">{format(day, 'EEE')}</div>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classStudents.map((student, index) => {
                  const stats = getAttendanceStats(student.Id);
                  
                  return (
                    <motion.tr
                      key={student.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      {monthDays.slice(0, 15).map(day => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const record = getAttendanceRecord(student.Id, dateStr);
                        
                        return (
                          <td key={day.toISOString()} className={`px-2 py-4 text-center ${isToday(day) ? 'bg-primary-50' : ''}`}>
                            <div className="flex justify-center">
                              <select
                                value={record?.status || ''}
                                onChange={(e) => handleAttendanceChange(student.Id, dateStr, e.target.value)}
                                className="w-8 h-8 text-xs border-none bg-transparent focus:ring-2 focus:ring-primary-500 rounded cursor-pointer"
                              >
                                <option value="">—</option>
                                {statusOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label[0]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {stats.percentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {stats.present}/{stats.total}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Mark Modal */}
      {showQuickMark && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Mark All Students
              </h3>
              <p className="text-sm text-gray-600">
                Mark all students for {selectedDate}
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map(status => (
                  <Button
                    key={status.value}
                    onClick={() => handleQuickMarkAll(status.value)}
                    variant={status.value === 'present' ? 'primary' : 'outline'}
                    icon={status.icon}
                    className="justify-center"
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowQuickMark(false)}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Attendance;