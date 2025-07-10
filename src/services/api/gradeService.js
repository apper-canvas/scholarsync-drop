const gradeService = {
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
          { field: { Name: "assignment_id" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { field: { Name: "student_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database field names to UI field names
      const data = response.data?.map(grade => ({
        ...grade,
        studentId: grade.student_id,
        assignmentId: grade.assignment_id,
        submittedDate: grade.submitted_date
      })) || [];
      
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { field: { Name: "assignment_id" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { field: { Name: "student_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('grade', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      // Map database field names to UI field names
      const grade = response.data;
      if (grade) {
        grade.studentId = grade.student_id;
        grade.assignmentId = grade.assignment_id;
        grade.submittedDate = grade.submitted_date;
      }
      
      return grade;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (gradeData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Grade for Student ${gradeData.studentId}`,
          student_id: gradeData.studentId,
          assignment_id: gradeData.assignmentId,
          score: gradeData.score,
          submitted_date: gradeData.submittedDate,
          comments: gradeData.comments || ""
        }]
      };
      
      const response = await apperClient.createRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create grade');
        }
        
        const newGrade = successfulRecords[0]?.data;
        if (newGrade) {
          newGrade.studentId = newGrade.student_id;
          newGrade.assignmentId = newGrade.assignment_id;
          newGrade.submittedDate = newGrade.submitted_date;
        }
        
        return newGrade;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, gradeData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Grade for Student ${gradeData.studentId}`,
          student_id: gradeData.studentId,
          assignment_id: gradeData.assignmentId,
          score: gradeData.score,
          submitted_date: gradeData.submittedDate,
          comments: gradeData.comments || ""
        }]
      };
      
      const response = await apperClient.updateRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update grade');
        }
        
        const updatedGrade = successfulUpdates[0]?.data;
        if (updatedGrade) {
          updatedGrade.studentId = updatedGrade.student_id;
          updatedGrade.assignmentId = updatedGrade.assignment_id;
          updatedGrade.submittedDate = updatedGrade.submitted_date;
        }
        
        return updatedGrade;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete grade');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default gradeService;