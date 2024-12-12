import apiClient from './ApiSetup/api';

export const fetchEmarks = async () => {
  try {
    const response = await apiClient.get('/emark'); // Send the GET request to the server

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
export const fetchEmark = async (id) => {
  try {
    const response = await apiClient.get(`/emark/${id}`); // Send the GET request to the server

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
export const createEmark = async (emarkData) => {
  try {
    const response = await apiClient.post(`/emark/create`, emarkData); // Send the GET request to the server

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
export const updateEmark = async (id, updatedEmark) => {
  try {
    const response = await apiClient.put(`/emark/update/${id}`, updatedEmark); // Send the GET request to the server

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
    const response = await apiClient.get(`/historylog/emark/${id}`); // Send the GET request to the server

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
