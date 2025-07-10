import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import studentService from '@/services/api/studentService';

const Students = () => {
  const { searchValue } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    enrollmentDate: '',
    gradeLevel: '',
    studentId: '',
    photoUrl: ''
  });

  const gradeLevels = [
    { value: '9th', label: '9th Grade' },
    { value: '10th', label: '10th Grade' },
    { value: '11th', label: '11th Grade' },
    { value: '12th', label: '12th Grade' }
  ];

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students. Please try again.');
      console.error('Students loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

const filteredStudents = students.filter(student =>
    searchValue === '' || 
    (student.first_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
    (student.last_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
    (student.email || '').toLowerCase().includes(searchValue.toLowerCase()) ||
    (student.student_id || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, formData);
        toast.success('Student updated successfully!');
      } else {
        await studentService.create(formData);
        toast.success('Student added successfully!');
      }
      
      await loadStudents();
      resetForm();
    } catch (err) {
      toast.error('Failed to save student. Please try again.');
      console.error('Student save error:', err);
    }
  };

const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.first_name || '',
      lastName: student.last_name || '',
      email: student.email || '',
      dateOfBirth: student.date_of_birth || '',
      enrollmentDate: student.enrollment_date || '',
      gradeLevel: student.grade_level || '',
      studentId: student.student_id || '',
      photoUrl: student.photo_url || ''
    });
    setShowModal(true);
  };

const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success('Student deleted successfully!');
        await loadStudents();
      } catch (err) {
        toast.error('Failed to delete student. Please try again.');
        console.error('Student delete error:', err);
      }
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      enrollmentDate: '',
      gradeLevel: '',
      studentId: '',
      photoUrl: ''
    });
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  if (students.length === 0) {
    return (
      <Empty
        title="No students yet"
        description="Start building your class roster by adding your first student."
        icon="Users"
        actionLabel="Add First Student"
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
            {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
          </h2>
          <p className="text-sm text-gray-600">
            Manage your student roster and information
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon="Plus"
        >
          Add Student
        </Button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Student Roster</h3>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="p-12">
            <Empty
              title="No students found"
              description="Try adjusting your search criteria or add a new student."
              icon="Search"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
{student.photo_url ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={student.photo_url} 
                              alt={`${student.first_name} ${student.last_name}`} 
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {student.first_name?.[0] || 'U'}{student.last_name?.[0] || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
<div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
<Badge variant="primary" size="sm">
                        {student.grade_level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.enrollment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          onClick={() => handleEdit(student)}
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                        />
                        <Button
                          onClick={() => handleDelete(student)}
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          className="text-red-600 hover:text-red-900 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Grade Level"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  options={gradeLevels}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Enrollment Date"
                  name="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Input
                label="Photo URL (Optional)"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/photo.jpg"
              />
              
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
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Students;