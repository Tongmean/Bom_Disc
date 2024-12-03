import apiClient from './ApiSetup/api';

export const fetchShims = async () => {
  try {
    const response = await apiClient.get('/shim'); // Send the GET request to the server

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
export const fetchShim = async (id) => {
  try {
    const response = await apiClient.get(`/shim/${id}`); // Send the GET request to the server

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
export const createShim = async (shimData) => {
  try {
    const response = await apiClient.post(`/shim/create`, shimData); // Send the GET request to the server

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
export const updateShim = async (id, updatedShim) => {
  try {
    const response = await apiClient.put(`/shim/update/${id}`, updatedShim); // Send the GET request to the server

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
    const response = await apiClient.get(`/historylog/shim/${id}`); // Send the GET request to the server

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
