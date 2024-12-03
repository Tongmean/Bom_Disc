import apiClient from './ApiSetup/api';

export const fetchusers = async () => {
  try {
    const response = await apiClient.get('/user'); // Send the GET request to the server

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
export const fetchUser = async (id) => {
  try {
    const response = await apiClient.get(`/user/${id}`); // Send the GET request to the server

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
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post(`/user/create`, userData); // Send the GET request to the server

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
export const updateUser = async (id, updatedUser) => {
  try {
    const response = await apiClient.put(`/user/update/${id}`, updatedUser); // Send the GET request to the server

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

// export const fetchHistoryLog = async (id) => {
//   try {
//     const response = await apiClient.get(`/historylog/user/${id}`); // Send the GET request to the server

//     // Check the response's 'success' field to determine if the request was successful
//     if (response.data.success) {
//       // If successful, return the 'data' part of the response
//       return response.data.data; // Assuming 'data' contains the users
//     } else {
//       // If success is false, throw an error with the server message
//       throw new Error(response.data.msg);
//     }
//   } catch (error) {
//     // Catch and rethrow the error with a message from the server or a generic one
//     throw new Error(error.response?.data?.msg);
//   }
// };
