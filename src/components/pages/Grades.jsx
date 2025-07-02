import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import GradeCell from '@/components/molecules/GradeCell';
import ApperIcon from '@/components/ApperIcon';
import gradeService from '@/services/api/gradeService';
import assignmentService from '@/services/api/assignmentService';
import studentService from '@/services/api/studentService';
import classService from '@/services/api/classService';

const Grades = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    name: '',
    category: '',
    pointsPossible: '',
    dueDate: '',
    weight: '1'
  });
  const [gradeForm, setGradeForm] = useState({
    score: '',
    comments: ''
  });

  const assignmentCategories = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'test', label: 'Test' },
    { value: 'project', label: 'Project' },
    { value: 'participation', label: 'Participation' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [classesData, studentsData, assignmentsData, gradesData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
      
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0].Id.toString());
      }
    } catch (err) {
      setError('Failed to load gradebook data. Please try again.');
      console.error('Gradebook loading error:', err);
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

  const getCurrentClassAssignments = () => {
    if (!selectedClass) return [];
    return assignments.filter(assignment => assignment.classId.toString() === selectedClass);
  };

  const getGrade = (studentId, assignmentId) => {
    return grades.find(grade => 
      grade.studentId === studentId && grade.assignmentId === assignmentId
    );
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const assignmentData = {
        ...assignmentForm,
        classId: parseInt(selectedClass),
        pointsPossible: parseFloat(assignmentForm.pointsPossible),
        weight: parseFloat(assignmentForm.weight)
      };
      
      await assignmentService.create(assignmentData);
      toast.success('Assignment created successfully!');
      
      await loadData();
      resetAssignmentForm();
    } catch (err) {
      toast.error('Failed to create assignment. Please try again.');
      console.error('Assignment creation error:', err);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const gradeData = {
        studentId: selectedStudent.Id,
        assignmentId: selectedAssignment.Id,
        score: parseFloat(gradeForm.score),
        submittedDate: new Date().toISOString().split('T')[0],
        comments: gradeForm.comments
      };
      
      const existingGrade = getGrade(selectedStudent.Id, selectedAssignment.Id);
      
      if (existingGrade) {
        await gradeService.update(existingGrade.Id, gradeData);
        toast.success('Grade updated successfully!');
      } else {
        await gradeService.create(gradeData);
        toast.success('Grade added successfully!');
      }
      
      await loadData();
      resetGradeForm();
    } catch (err) {
      toast.error('Failed to save grade. Please try again.');
      console.error('Grade save error:', err);
    }
  };

  const handleGradeClick = (student, assignment) => {
    setSelectedStudent(student);
    setSelectedAssignment(assignment);
    
    const existingGrade = getGrade(student.Id, assignment.Id);
    setGradeForm({
      score: existingGrade ? existingGrade.score.toString() : '',
      comments: existingGrade ? existingGrade.comments : ''
    });
    
    setShowGradeModal(true);
  };

  const resetAssignmentForm = () => {
    setShowAssignmentModal(false);
    setAssignmentForm({
      name: '',
      category: '',
      pointsPossible: '',
      dueDate: '',
      weight: '1'
    });
  };

  const resetGradeForm = () => {
    setShowGradeModal(false);
    setSelectedStudent(null);
    setSelectedAssignment(null);
    setGradeForm({
      score: '',
      comments: ''
    });
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
        description="Create classes first to start managing grades and assignments."
        icon="BookOpen"
      />
    );
  }

  const classStudents = getCurrentClassStudents();
  const classAssignments = getCurrentClassAssignments();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select
            label="Select Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={classes.map(c => ({ value: c.Id.toString(), label: `${c.name} - ${c.subject}` }))}
            placeholder="Choose a class"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowAssignmentModal(true)}
            variant="outline"
            icon="FileText"
            disabled={!selectedClass}
          >
            Add Assignment
          </Button>
          <Button
            onClick={() => window.print()}
            variant="secondary"
            icon="Printer"
            disabled={!selectedClass || classStudents.length === 0}
          >
            Print Grades
          </Button>
        </div>
      </div>

      {/* Gradebook Table */}
      {!selectedClass ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <Empty
            title="Select a class"
            description="Choose a class from the dropdown to view and manage grades."
            icon="BookOpen"
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
              Gradebook - {classes.find(c => c.Id.toString() === selectedClass)?.name}
            </h3>
            <div className="text-sm text-gray-500">
              {classStudents.length} students • {classAssignments.length} assignments
            </div>
          </div>
          
          {classAssignments.length === 0 ? (
            <div className="p-12">
              <Empty
                title="No assignments yet"
                description="Create your first assignment to start grading students."
                icon="FileText"
                actionLabel="Add Assignment"
                onAction={() => setShowAssignmentModal(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Student
                    </th>
                    {classAssignments.map(assignment => (
                      <th key={assignment.Id} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        <div>
                          <div className="font-semibold">{assignment.name}</div>
                          <div className="text-xs text-gray-400 capitalize">
                            {assignment.category} • {assignment.pointsPossible}pts
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classStudents.map((student, index) => {
                    const studentGrades = classAssignments.map(assignment => {
                      const grade = getGrade(student.Id, assignment.Id);
                      return grade ? grade.score : null;
                    });
                    
                    const validGrades = studentGrades.filter(score => score !== null);
                    const average = validGrades.length > 0 
                      ? (validGrades.reduce((sum, score) => sum + score, 0) / validGrades.length).toFixed(1)
                      : '—';

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
                        {classAssignments.map(assignment => {
                          const grade = getGrade(student.Id, assignment.Id);
                          return (
                            <td
                              key={assignment.Id}
                              className="px-3 py-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleGradeClick(student, assignment)}
                            >
                              <GradeCell
                                score={grade?.score}
                                maxScore={assignment.pointsPossible}
                                assignment={assignment}
                              />
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-center font-semibold text-gray-900">
                          {average}%
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Assignment
              </h3>
            </div>
            
            <form onSubmit={handleAssignmentSubmit} className="p-6 space-y-4">
              <Input
                label="Assignment Name"
                name="name"
                value={assignmentForm.name}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Chapter 5 Quiz"
                required
              />
              
              <Select
                label="Category"
                name="category"
                value={assignmentForm.category}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, category: e.target.value }))}
                options={assignmentCategories}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Points Possible"
                  name="pointsPossible"
                  type="number"
                  min="1"
                  value={assignmentForm.pointsPossible}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, pointsPossible: e.target.value }))}
                  required
                />
                <Input
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={resetAssignmentForm}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Add Assignment
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Grade Entry Modal */}
      {showGradeModal && selectedStudent && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Enter Grade
              </h3>
              <p className="text-sm text-gray-600">
                {selectedStudent.firstName} {selectedStudent.lastName} • {selectedAssignment.name}
              </p>
            </div>
            
            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
              <Input
                label={`Score (out of ${selectedAssignment.pointsPossible})`}
                name="score"
                type="number"
                min="0"
                max={selectedAssignment.pointsPossible}
                step="0.1"
                value={gradeForm.score}
                onChange={(e) => setGradeForm(prev => ({ ...prev, score: e.target.value }))}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  name="comments"
                  rows={3}
                  value={gradeForm.comments}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, comments: e.target.value }))}
                  className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150"
                  placeholder="Add feedback for the student..."
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={resetGradeForm}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Save Grade
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Grades;