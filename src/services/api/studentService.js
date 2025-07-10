const studentService = {
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "date_of_birth" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "grade_level" } },
          { field: { Name: "student_id" } },
          { field: { Name: "photo_url" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('student', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "date_of_birth" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "grade_level" } },
          { field: { Name: "student_id" } },
          { field: { Name: "photo_url" } }
        ]
      };
      
      const response = await apperClient.getRecordById('student', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (studentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Map UI field names to database field names
      const params = {
        records: [{
          Name: studentData.firstName + ' ' + studentData.lastName,
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          email: studentData.email,
          date_of_birth: studentData.dateOfBirth,
          enrollment_date: studentData.enrollmentDate,
          grade_level: studentData.gradeLevel,
          student_id: studentData.studentId,
          photo_url: studentData.photoUrl || ""
        }]
      };
      
      const response = await apperClient.createRecord('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create student');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, studentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Map UI field names to database field names
      const params = {
        records: [{
          Id: parseInt(id),
          Name: studentData.firstName + ' ' + studentData.lastName,
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          email: studentData.email,
          date_of_birth: studentData.dateOfBirth,
          enrollment_date: studentData.enrollmentDate,
          grade_level: studentData.gradeLevel,
          student_id: studentData.studentId,
          photo_url: studentData.photoUrl || ""
        }]
      };
      
      const response = await apperClient.updateRecord('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update student');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete student');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default studentService;