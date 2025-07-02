import classesData from '@/services/mockData/classes.json';

let classes = [...classesData];

const classService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...classes];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return classes.find(classItem => classItem.Id === parseInt(id));
  },

  create: async (classData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = classes.length > 0 ? Math.max(...classes.map(c => c.Id)) : 0;
    const newClass = {
      Id: maxId + 1,
      ...classData,
      studentIds: classData.studentIds || []
    };
    
    classes.push(newClass);
    return newClass;
  },

  update: async (id, classData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = classes.findIndex(classItem => classItem.Id === parseInt(id));
    if (index !== -1) {
      classes[index] = {
        ...classes[index],
        ...classData
      };
      return classes[index];
    }
    throw new Error('Class not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = classes.findIndex(classItem => classItem.Id === parseInt(id));
    if (index !== -1) {
      const deletedClass = classes.splice(index, 1)[0];
      return deletedClass;
    }
    throw new Error('Class not found');
  }
};

export default classService;