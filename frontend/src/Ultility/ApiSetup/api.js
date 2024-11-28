import axios from 'axios';

// Create a base Axios instance with default configurations
const apiClient = axios.create({
  baseURL: 'http://localhost:3031/api', // Replace with your API's base URL
  timeout: 5000, // Set a default timeout for requests
  headers: {
    'Content-Type': 'application/json', // Set default Content-Type for requests
  },
});

// Add interceptors if needed (optional)
// Example: Adding a request interceptor for authorization tokens
apiClient.interceptors.request.use(
    (config) => {
      const user = JSON.parse(localStorage.getItem('user')); // Parse user object from localStorage
      if (user?.token && !config.url.includes('/user/login')) {
        // Add Authorization header only if the request is NOT for login
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
  


export default apiClient;
