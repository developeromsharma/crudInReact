import React, { useEffect, useState, useContext } from 'react';
import { getCourses } from '../api/courseService';
import { getAssignedCourses } from '../api/assignmentService';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [allCourses, setAllCourses] = useState([]);
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [loadingAll, setLoadingAll] = useState(true);
    const [loadingAssigned, setLoadingAssigned] = useState(true);

    useEffect(() => {
        if (token) {
            loadAllCourses();
            loadAssignedCourses();
        }
    }, [token]);

    const loadAllCourses = async () => {
        try {
            const response = await getCourses(); // /api/course
            if (response.data?.data) {
                setAllCourses(response.data.data);
            }
        } catch (err) {
            console.error("Error loading all courses:", err);
        } finally {
            setLoadingAll(false);
        }
    };

    const loadAssignedCourses = async () => {
        try {
            const response = await getAssignedCourses(); // /api/course/my-courses
            if (response.data?.data) {
                setAssignedCourses(response.data.data);
            }
        } catch (err) {
            console.error("Error loading assigned courses:", err);
        } finally {
            setLoadingAssigned(false);
        }
    };

    if (!token) return <div>Please login.</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">
                Hi {user?.userName || 'User'}, welcome to course dashboard
            </h2>

            <h3 className="text-center mb-4">My Assigned Courses</h3>

            {loadingAssigned ? (
                <p className="text-center">Loading assigned courses...</p>
            ) : assignedCourses.length === 0 ? (
                <p className="text-center text-muted">No course assigned</p>
            ) : (
                <table className="table table-bordered text-center mb-5">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedCourses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.courseName}</td>
                                <td>{course.courseCode}</td>
                                <td>{course.courseRating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3 className="text-center mb-4">All Available Courses</h3>

            {loadingAll ? (
                <p className="text-center">Loading all courses...</p>
            ) : allCourses.length === 0 ? (
                <p className="text-center text-muted">No courses available</p>
            ) : (
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCourses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.courseName}</td>
                                <td>{course.courseCode}</td>
                                <td>{course.courseRating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserDashboard;
