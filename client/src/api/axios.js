import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL: 'https://teamsync-backend-five.vercel.app/api'
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Interceptor Token:', token); // Debugging
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
