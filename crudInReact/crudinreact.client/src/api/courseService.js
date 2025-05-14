// courseService.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7226/api/courses',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or check the context if you're using Context instead
        if (token) {
            console.log('Adding Authorization header with token:', token); // Debug log
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export const getCourses = async () => {
    const response = await axiosInstance.get('/GetAll');
    return response.data;
};

export const createCourse = async (course) => {
    const response = await axiosInstance.post('', course);
    return response.data;
};

export const updateCourse = async (id, course) => {
    try {
        const response = await axiosInstance.put(`/${id}`, course);
        return response.data;
    } catch (error) {
        console.error('Error during PUT request:', error);
        if (error.response) {
            console.error('Backend error:', error.response.data);
        }
        throw error;
    }
};

export const deleteCourse = async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
};
