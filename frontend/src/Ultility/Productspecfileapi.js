
import apiClient from './ApiSetup/api';

export const createProductspecfileapi = async (formData) => {
    try {
      const response = await apiClient.post(`/file/productspec/create`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      }); // Send the GET request to the server
  
      // Check the response's 'success' field to determine if the request was successful
      if (response.data.success) {
        // If successful, return the 'data' part of the response
        return response.data; // Assuming 'data' contains the users
      } else {
        // If success is false, throw an error with the server message
        throw new Error(response.data.msg);
      }
    } catch (error) {
      // Catch and rethrow the error with a message from the server or a generic one
      throw new Error(error.response?.data?.msg);
    }
};

export const UpdateProdctspecfileapi = async (id,formData) => {
    try {
      const response = await apiClient.put(`/file/productspec/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      }); // Send the GET request to the server
  
      // Check the response's 'success' field to determine if the request was successful
      if (response.data.success) {
        // If successful, return the 'data' part of the response
        return response.data; // Assuming 'data' contains the users
      } else {
        // If success is false, throw an error with the server message
        throw new Error(response.data.msg);
      }
    } catch (error) {
      // Catch and rethrow the error with a message from the server or a generic one
      throw new Error(error.response?.data?.msg);
    }
};


export const fetchProductspecfiles = async () => {
    try {
      const response = await apiClient.get(`/file/productspec`); // Send the GET request to the server
  
      // Check the response's 'success' field to determine if the request was successful
      if (response.data.success) {
        // If successful, return the 'data' part of the response
        return response.data; // Assuming 'data' contains the users
      } else {
        // If success is false, throw an error with the server message
        throw new Error(response.data.msg);
      }
    } catch (error) {
      // Catch and rethrow the error with a message from the server or a generic one
      throw new Error(error.response?.data?.msg);
    }
};

export const fetchProductspecfile = async (id) => {
    try {
      const response = await apiClient.get(`/file/productspec/${id}`); // Send the GET request to the server
  
      // Check the response's 'success' field to determine if the request was successful
      if (response.data.success) {
        // If successful, return the 'data' part of the response
        return response.data; // Assuming 'data' contains the users
      } else {
        // If success is false, throw an error with the server message
        throw new Error(response.data.msg);
      }
    } catch (error) {
      // Catch and rethrow the error with a message from the server or a generic one
      throw new Error(error.response?.data?.msg);
    }
};

export const fetchHistoryLog = async (id) => {
    try {
      const response = await apiClient.get(`/historylog/productspecfile/${id}`); // Send the GET request to the server
  
      // Check the response's 'success' field to determine if the request was successful
      if (response.data.success) {
        // If successful, return the 'data' part of the response
        return response.data.data; // Assuming 'data' contains the users
      } else {
        // If success is false, throw an error with the server message
        throw new Error(response.data.msg);
      }
    } catch (error) {
      // Catch and rethrow the error with a message from the server or a generic one
      throw new Error(error.response?.data?.msg);
    }
};