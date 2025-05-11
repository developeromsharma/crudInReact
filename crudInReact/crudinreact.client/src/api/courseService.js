// courseService.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7226/api/courses',
    headers: {
        'Content-Type': 'application/json',
    }
});

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
        // Log the URL and headers to ensure the request is correctly formed
        console.log(`Sending PUT request to: https://localhost:7226/api/courses/${id}`);
        console.log('Request Headers:', axiosInstance.defaults.headers);

        console.log("Final course object sent:", course);

        // Perform the PUT request
        const response = await axiosInstance.put(`/${id}`, course);

        // Log the response for debugging
        console.log('Response from server:', response.data);

        return response.data;
    } catch (error) {
        // Log detailed error object
        console.error('Error during PUT request:', error);  // Log full error object for debugging

        // Check if the error has a response property, which contains details from the backend
        if (error.response) {
            console.error('Error response data:', error.response.data);  // Backend error message
            console.error('Error response status:', error.response.status);  // HTTP status code
            console.error('Error response headers:', error.response.headers);  // Response headers
        } else {
            console.error('Error message:', error.message);  // If no response, log the message
        }

        // Re-throw the error so it can be handled further
        throw error;
    }
};



export const deleteCourse = async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
};
