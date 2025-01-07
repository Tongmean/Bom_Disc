import apiClient from './ApiSetup/api';

export const fetchOuters = async () => {
  try {
    const response = await apiClient.get('/outer'); // Send the GET request to the server

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
}
export const fetchOuter = async (id) => {
  try {
    const response = await apiClient.get(`/outer/${id}`); // Send the GET request to the server

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
}
export const createOuterapi = async (outer) => {
  try {
    const response = await apiClient.post(`/outer/create`, outer); // Send the GET request to the server

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
}
export const updateOuter = async (id, outer) => {
  try {
    const response = await apiClient.put(`/outer/update/${id}`, outer); // Send the GET request to the server

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
}
export const fetchHistoryLog = async (id) => {
    try {
      const response = await apiClient.get(`/historylog/outer/${id}`); // Send the GET request to the server
  
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