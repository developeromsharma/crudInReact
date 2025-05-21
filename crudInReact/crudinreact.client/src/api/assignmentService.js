import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7226/api/assignment',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

//export const assignCourseToUser = async (userId, courseId) => {
//    const payload = { userId, courseId };
//    return await axiosInstance.post('/assign', payload);
//};

export const assignCourseToUser = async (userId, courseId) => {
    return await axiosInstance.post('/assign', {
        userId: parseInt(userId),
        courseId: parseInt(courseId)
    });
};


export const unassignCourseFromUser = async (userId, courseId) => {
    return await axiosInstance.delete(`/unassign?userId=${userId}&courseId=${courseId}`);
};

export const getAssignedCourses = async (userId = null, userName = null) => {
    let query = '/my-courses';

    if (userId) {
        query += `?userId=${userId}`;
    } else if (userName) {
        query += `?userName=${encodeURIComponent(userName)}`;
    }

    return await axiosInstance.get(query);
};
