import axios from 'axios';
export const baseURLclient = 'http://localhost:3001';
export const baseURL = 'http://localhost:3031';
// export const baseURLclient = 'http://192.168.4.242:3001';
// export const baseURL = 'http://192.168.4.242:3031';
export const baseURLdrawing = `${baseURL}/Assets/Drawing`;
export const baseURLproductspec = `${baseURL}/Assets/Productspec`;
export const baseURLshim = `${baseURL}/Assets/Shim`;
export const baseURLpackage = `${baseURL}/Assets/Package`;
// Create a base Axios instance with default configurations
const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // Replace with your API's base URL
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
