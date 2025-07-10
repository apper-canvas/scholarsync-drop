const assignmentService = {
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
          { field: { Name: "category" } },
          { field: { Name: "points_possible" } },
          { field: { Name: "due_date" } },
          { field: { Name: "weight" } },
          { field: { Name: "class_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database field names to UI field names
      const data = response.data?.map(assignment => ({
        ...assignment,
        pointsPossible: assignment.points_possible,
        dueDate: assignment.due_date,
        classId: assignment.class_id
      })) || [];
      
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "category" } },
          { field: { Name: "points_possible" } },
          { field: { Name: "due_date" } },
          { field: { Name: "weight" } },
          { field: { Name: "class_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('assignment', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      // Map database field names to UI field names
      const assignment = response.data;
      if (assignment) {
        assignment.pointsPossible = assignment.points_possible;
        assignment.dueDate = assignment.due_date;
        assignment.classId = assignment.class_id;
      }
      
      return assignment;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (assignmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: assignmentData.name,
          category: assignmentData.category,
          points_possible: assignmentData.pointsPossible,
          due_date: assignmentData.dueDate,
          weight: assignmentData.weight,
          class_id: assignmentData.classId
        }]
      };
      
      const response = await apperClient.createRecord('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create assignment');
        }
        
        const newAssignment = successfulRecords[0]?.data;
        if (newAssignment) {
          newAssignment.pointsPossible = newAssignment.points_possible;
          newAssignment.dueDate = newAssignment.due_date;
          newAssignment.classId = newAssignment.class_id;
        }
        
        return newAssignment;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, assignmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.name,
          category: assignmentData.category,
          points_possible: assignmentData.pointsPossible,
          due_date: assignmentData.dueDate,
          weight: assignmentData.weight,
          class_id: assignmentData.classId
        }]
      };
      
      const response = await apperClient.updateRecord('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update assignment');
        }
        
        const updatedAssignment = successfulUpdates[0]?.data;
        if (updatedAssignment) {
          updatedAssignment.pointsPossible = updatedAssignment.points_possible;
          updatedAssignment.dueDate = updatedAssignment.due_date;
          updatedAssignment.classId = updatedAssignment.class_id;
        }
        
        return updatedAssignment;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete assignment');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default assignmentService;