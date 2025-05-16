import React, { useEffect, useState, useContext } from 'react';
import { getCourses } from '../api/courseService';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
    const { token } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    const loadCourses = async () => {
        try {
            const response = await getCourses();
            if (response.data?.data) setCourses(response.data.data);
        } catch (err) {
            console.error("Error loading courses:", err);
        }
    };

    useEffect(() => {
        if (token) loadCourses();
    }, [token]);

    if (!token) return <div>Please login.</div>;

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Available Courses</h3>
            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr><th>Name</th><th>Code</th><th>Rating</th></tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseName}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.courseRating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserDashboard;