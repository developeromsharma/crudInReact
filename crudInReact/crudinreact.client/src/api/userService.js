import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7226/api/user',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getNonAdminUsers = async () => {
    return await axiosInstance.get('/non-admin');
};
