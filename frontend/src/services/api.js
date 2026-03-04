import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Pointing to the Laravel backend API
    headers: {
        'Accept': 'application/json',
    },
    // Setting withCredentials to true if you are using Sanctum SPA authentication (cookie-based).
    // If using token-based authentication (Bearer token), this can be omitted or false.
    // withCredentials: true, 
});

// Add a request interceptor to append the Authorization token
api.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage (or your preferred storage mechanism)
        const token = localStorage.getItem('token');

        // If a token exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors (e.g., unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if the error is 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired, handle logout/redirect here
            console.warn('Unauthorized request. Token might be invalid or expired.');
            // Example: 
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
