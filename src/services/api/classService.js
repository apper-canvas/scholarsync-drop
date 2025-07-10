const classService = {
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
          { field: { Name: "subject" } },
          { field: { Name: "section" } },
          { field: { Name: "schedule" } },
          { field: { Name: "room" } },
          { field: { Name: "student_ids" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('class', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert student_ids from comma-separated string to array
      const data = response.data?.map(classItem => ({
        ...classItem,
        studentIds: classItem.student_ids ? classItem.student_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      })) || [];
      
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message);
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
          { field: { Name: "subject" } },
          { field: { Name: "section" } },
          { field: { Name: "schedule" } },
          { field: { Name: "room" } },
          { field: { Name: "student_ids" } }
        ]
      };
      
      const response = await apperClient.getRecordById('class', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      // Convert student_ids from comma-separated string to array
      const classItem = response.data;
      if (classItem) {
        classItem.studentIds = classItem.student_ids ? classItem.student_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
      }
      
      return classItem;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (classData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert studentIds array to comma-separated string
      const studentIdsString = classData.studentIds && classData.studentIds.length > 0 
        ? classData.studentIds.join(',') 
        : '';
      
      const params = {
        records: [{
          Name: classData.name,
          subject: classData.subject,
          section: classData.section || '',
          schedule: classData.schedule,
          room: classData.room,
          student_ids: studentIdsString
        }]
      };
      
      const response = await apperClient.createRecord('class', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create class');
        }
        
        const newClass = successfulRecords[0]?.data;
        if (newClass) {
          newClass.studentIds = newClass.student_ids ? newClass.student_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        }
        
        return newClass;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, classData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert studentIds array to comma-separated string
      const studentIdsString = classData.studentIds && classData.studentIds.length > 0 
        ? classData.studentIds.join(',') 
        : '';
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: classData.name,
          subject: classData.subject,
          section: classData.section || '',
          schedule: classData.schedule,
          room: classData.room,
          student_ids: studentIdsString
        }]
      };
      
      const response = await apperClient.updateRecord('class', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update class');
        }
        
        const updatedClass = successfulUpdates[0]?.data;
        if (updatedClass) {
          updatedClass.studentIds = updatedClass.student_ids ? updatedClass.student_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        }
        
        return updatedClass;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating class:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('class', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete class');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default classService;