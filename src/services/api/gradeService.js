import gradesData from '@/services/mockData/grades.json';

let grades = [...gradesData];

const gradeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...grades];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades.find(grade => grade.Id === parseInt(id));
  },

  create: async (gradeData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
    const newGrade = {
      Id: maxId + 1,
      ...gradeData
    };
    
    grades.push(newGrade);
    return newGrade;
  },

  update: async (id, gradeData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = {
        ...grades[index],
        ...gradeData
      };
      return grades[index];
    }
    throw new Error('Grade not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    if (index !== -1) {
      const deletedGrade = grades.splice(index, 1)[0];
      return deletedGrade;
    }
    throw new Error('Grade not found');
  }
};

export default gradeService;