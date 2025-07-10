const attendanceService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id" } },
          { field: { Name: "class_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database field names to UI field names
      const data = response.data?.map(attendance => ({
        ...attendance,
        studentId: attendance.student_id,
        classId: attendance.class_id
      })) || [];
      
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id" } },
          { field: { Name: "class_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ]
      };
      
      const response = await apperClient.getRecordById('attendance', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      // Map database field names to UI field names
      const attendance = response.data;
      if (attendance) {
        attendance.studentId = attendance.student_id;
        attendance.classId = attendance.class_id;
      }
      
      return attendance;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (attendanceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Attendance for ${attendanceData.date}`,
          student_id: attendanceData.studentId,
          class_id: attendanceData.classId,
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || ""
        }]
      };
      
      const response = await apperClient.createRecord('attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create attendance record');
        }
        
        const newAttendance = successfulRecords[0]?.data;
        if (newAttendance) {
          newAttendance.studentId = newAttendance.student_id;
          newAttendance.classId = newAttendance.class_id;
        }
        
        return newAttendance;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, attendanceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Attendance for ${attendanceData.date}`,
          student_id: attendanceData.studentId,
          class_id: attendanceData.classId,
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || ""
        }]
      };
      
      const response = await apperClient.updateRecord('attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update attendance record');
        }
        
        const updatedAttendance = successfulUpdates[0]?.data;
        if (updatedAttendance) {
          updatedAttendance.studentId = updatedAttendance.student_id;
          updatedAttendance.classId = updatedAttendance.class_id;
        }
        
        return updatedAttendance;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete attendance record');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default attendanceService;