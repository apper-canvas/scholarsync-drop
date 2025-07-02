import studentsData from '@/services/mockData/students.json';

let students = [...studentsData];

const studentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return students.find(student => student.Id === parseInt(id));
  },

  create: async (studentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      Id: maxId + 1,
      ...studentData,
      photoUrl: studentData.photoUrl || null
    };
    
    students.push(newStudent);
    return newStudent;
  },

  update: async (id, studentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      students[index] = {
        ...students[index],
        ...studentData
      };
      return students[index];
    }
    throw new Error('Student not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      const deletedStudent = students.splice(index, 1)[0];
      return deletedStudent;
    }
    throw new Error('Student not found');
  }
};

export default studentService;