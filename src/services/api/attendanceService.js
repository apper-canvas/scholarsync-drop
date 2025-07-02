import attendanceData from '@/services/mockData/attendance.json';

let attendance = [...attendanceData];

const attendanceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...attendance];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendance.find(record => record.Id === parseInt(id));
  },

  create: async (attendanceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = attendance.length > 0 ? Math.max(...attendance.map(a => a.Id)) : 0;
    const newAttendance = {
      Id: maxId + 1,
      ...attendanceData
    };
    
    attendance.push(newAttendance);
    return newAttendance;
  },

  update: async (id, attendanceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = attendance.findIndex(record => record.Id === parseInt(id));
    if (index !== -1) {
      attendance[index] = {
        ...attendance[index],
        ...attendanceData
      };
      return attendance[index];
    }
    throw new Error('Attendance record not found');
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = attendance.findIndex(record => record.Id === parseInt(id));
    if (index !== -1) {
      const deletedAttendance = attendance.splice(index, 1)[0];
      return deletedAttendance;
    }
    throw new Error('Attendance record not found');
  }
};

export default attendanceService;