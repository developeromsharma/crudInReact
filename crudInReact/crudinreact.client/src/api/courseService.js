// courseService.jsx
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7226/api/courses',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token'); // or from context
        if (token) {
            console.log('Adding Authorization header with token:', token); // Debug log
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// GET all courses
export const getCourses = async () => {
    return await axiosInstance.get('/GetAll'); // full Axios response
};

// CREATE a new course
export const createCourse = async (course) => {
    return await axiosInstance.post('', course); // full Axios response
};

export const updateCourse = async (id, partialCourseData) => {
    try {
        const response = await axiosInstance.patch(`/${id}`, partialCourseData);
        return response;
    } catch (error) {
        console.error('Error during PATCH request:', error);
        throw error;
    }
};


// DELETE a course
export const deleteCourse = async (id) => {
    return await axiosInstance.delete(`/${id}`); // full Axios response
};
