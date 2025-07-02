import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import classService from '@/services/api/classService';
import studentService from '@/services/api/studentService';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    section: '',
    schedule: '',
    room: '',
    studentIds: []
  });

  const subjects = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Geography', label: 'Geography' },
    { value: 'Computer Science', label: 'Computer Science' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError('Failed to load classes. Please try again.');
      console.error('Classes loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentSelection = (studentId, checked) => {
    setFormData(prev => ({
      ...prev,
      studentIds: checked
        ? [...prev.studentIds, studentId]
        : prev.studentIds.filter(id => id !== studentId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await classService.update(editingClass.Id, formData);
        toast.success('Class updated successfully!');
      } else {
        await classService.create(formData);
        toast.success('Class created successfully!');
      }
      
      await loadData();
      resetForm();
    } catch (err) {
      toast.error('Failed to save class. Please try again.');
      console.error('Class save error:', err);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      subject: classItem.subject,
      section: classItem.section,
      schedule: classItem.schedule,
      room: classItem.room,
      studentIds: classItem.studentIds || []
    });
    setShowModal(true);
  };

  const handleDelete = async (classItem) => {
    if (window.confirm(`Are you sure you want to delete ${classItem.name}?`)) {
      try {
        await classService.delete(classItem.Id);
        toast.success('Class deleted successfully!');
        await loadData();
      } catch (err) {
        toast.error('Failed to delete class. Please try again.');
        console.error('Class delete error:', err);
      }
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({
      name: '',
      subject: '',
      section: '',
      schedule: '',
      room: '',
      studentIds: []
    });
  };

  const getEnrolledStudents = (studentIds) => {
    return students.filter(student => studentIds.includes(student.Id));
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (classes.length === 0) {
    return (
      <Empty
        title="No classes yet"
        description="Create your first class to start organizing students and curriculum."
        icon="BookOpen"
        actionLabel="Create First Class"
        onAction={() => setShowModal(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {classes.length} {classes.length === 1 ? 'Class' : 'Classes'}
          </h2>
          <p className="text-sm text-gray-600">
            Manage your classes and student enrollments
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon="Plus"
        >
          Create Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {classItem.name}
                </h3>
                <Badge variant="primary" size="sm">
                  {classItem.subject}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  onClick={() => handleEdit(classItem)}
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                />
                <Button
                  onClick={() => handleDelete(classItem)}
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  className="text-red-600 hover:text-red-900 hover:bg-red-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                {classItem.room}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                {classItem.schedule}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                {(classItem.studentIds || []).length} students enrolled
              </div>
              {classItem.section && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Hash" className="h-4 w-4 mr-2" />
                  Section {classItem.section}
                </div>
              )}
            </div>

            {(classItem.studentIds || []).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Enrolled Students:
                </p>
                <div className="flex flex-wrap gap-1">
                  {getEnrolledStudents(classItem.studentIds || []).slice(0, 3).map(student => (
                    <span
                      key={student.Id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {student.firstName} {student.lastName}
                    </span>
                  ))}
                  {(classItem.studentIds || []).length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      +{(classItem.studentIds || []).length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingClass ? 'Edit Class' : 'Create New Class'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Class Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Mathematics"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  options={subjects}
                  required
                />
                <Input
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  placeholder="e.g., A, B, 1, 2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon/Wed/Fri 10:00-11:00"
                  required
                />
                <Input
                  label="Room"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  placeholder="e.g., Room 201, Lab 3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enroll Students
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {students.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No students available. Add students first.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {students.map(student => (
                        <label
                          key={student.Id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.studentIds.includes(student.Id)}
                            onChange={(e) => handleStudentSelection(student.Id, e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.studentId} • {student.gradeLevel}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingClass ? 'Update Class' : 'Create Class'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Classes;