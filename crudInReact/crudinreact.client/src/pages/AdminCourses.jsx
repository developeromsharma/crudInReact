/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import {
    getCourses, createCourse, updateCourse, deleteCourse
} from '../api/courseService';
import {
    assignCourseToUser, unassignCourseFromUser, getAssignedCourses
} from '../api/assignmentService';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const AdminCourses = () => {
    const { token } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ courseName: '', courseCode: '', courseRating: '' });
    const [editId, setEditId] = useState(null);
    const [originalCourse, setOriginalCourse] = useState(null);

    // New states for assignment UI
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [userCourseMap, setUserCourseMap] = useState([]);

    // For viewing courses of selected user
    const [viewUserId, setViewUserId] = useState('');
    const [viewedCourses, setViewedCourses] = useState([]);

    // Load all courses
    const loadCourses = async () => {
        try {
            const response = await getCourses();
            if (response.data?.data) setCourses(response.data.data);
        } catch (err) {
            console.error("Error loading courses:", err);
        }
    };

    // Load non-admin users for dropdown
    const loadUsers = async () => {
        try {
            const res = await axios.get('https://localhost:7226/api/user/non-admin', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.data); // ApiResponse<List<NonAdminUserDto>>
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    // Load assigned courses per user (for assigned courses display)
    const loadUserCourseMap = async () => {
        try {
            const res = await axios.get('https://localhost:7226/api/assignment/my-courses', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserCourseMap(res.data.data);
        } catch (err) {
            console.error('Error loading assigned courses:', err);
        }
    };

    // Load courses assigned to the selected user (for view courses UI)
    const loadCoursesForSelectedUser = async (userId) => {
        try {
            const res = await getAssignedCourses(userId);
            setViewedCourses(res.data.data || []);
        } catch (err) {
            console.error("Error fetching user's courses:", err);
            alert('Failed to fetch courses for the selected user.');
        }
    };

    useEffect(() => {
        if (token) {
            loadCourses();
            loadUsers();
            loadUserCourseMap();
        }
    }, [token]);

    // When viewUserId changes, fetch courses assigned to that user
    useEffect(() => {
        if (viewUserId) {
            loadCoursesForSelectedUser(viewUserId);
        } else {
            setViewedCourses([]);
        }
    }, [viewUserId]);

    // CRUD handlers (unchanged)
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const getChangedFields = () => {
        const changed = {};
        if (form.courseName !== originalCourse?.courseName) changed.courseName = form.courseName;
        if (form.courseCode !== originalCourse?.courseCode) changed.courseCode = form.courseCode;
        if (parseFloat(form.courseRating) !== originalCourse?.courseRating) {
            changed.courseRating = parseFloat(form.courseRating);
        }
        return changed;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.courseName || !form.courseCode || !form.courseRating) return alert('Fill in all fields.');

        try {
            if (editId) {
                const changes = getChangedFields();
                if (Object.keys(changes).length === 0) return alert('No changes detected.');
                await updateCourse(editId, changes);
            } else {
                await createCourse({ ...form, courseRating: parseFloat(form.courseRating) });
            }
            setForm({ courseName: '', courseCode: '', courseRating: '' });
            setEditId(null);
            setOriginalCourse(null);
            loadCourses();
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const handleEdit = (course) => {
        setForm(course);
        setEditId(course.courseId);
        setOriginalCourse(course);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteCourse(id);
                loadCourses();
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Assign course to user handler
    const handleAssign = async () => {
        if (!selectedUserId || !selectedCourseId) {
            return alert('Please select both user and course.');
        }
        try {
            await assignCourseToUser(selectedUserId, parseInt(selectedCourseId));
            alert('Course assigned successfully!');
            setSelectedUserId('');
            setSelectedCourseId('');
            loadUserCourseMap();
            // Refresh viewed courses if currently viewing assigned courses for selected user
            if (viewUserId === selectedUserId) {
                loadCoursesForSelectedUser(selectedUserId);
            }
        } catch (error) {
            console.error('Error assigning course:', error);
            alert('Failed to assign course.');
        }
    };

    // Unassign course handler
    const handleUnassign = async (userId, courseId) => {
        if (!window.confirm('Are you sure you want to unassign this course?')) return;
        try {
            await unassignCourseFromUser(userId, courseId);
            alert('Course unassigned successfully!');
            loadUserCourseMap();
            if (viewUserId === userId) {
                loadCoursesForSelectedUser(userId);
            }
        } catch (error) {
            console.error('Error unassigning course:', error);
            alert('Failed to unassign course.');
        }
    };

    if (!token) return <div>Please login.</div>;

    return (
        <div className="container mt-5">
            {/* --- Original CRUD form and table --- */}
            <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
                <input
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="form-control"
                    required
                />
                <input
                    name="courseCode"
                    value={form.courseCode}
                    onChange={handleChange}
                    placeholder="Code"
                    className="form-control"
                    required
                />
                <input
                    name="courseRating"
                    value={form.courseRating}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    placeholder="Rating"
                    className="form-control"
                    required
                />
                <button type="submit" className={`btn ${editId ? 'btn-success' : 'btn-primary'}`}>
                    {editId ? 'Update' : 'Add'}
                </button>
            </form>

            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseName}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.courseRating}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning mx-1"
                                    onClick={() => handleEdit(course)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger mx-1"
                                    onClick={() => handleDelete(course.courseId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- New: Assign course to user UI --- */}
            <h3>Assign Course to User</h3>
            <div className="row g-2 mb-4">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <button className="btn btn-success w-100" onClick={handleAssign}>
                        Assign
                    </button>
                </div>
            </div>

            {/* --- New: View courses assigned to a selected user --- */}
            <h3>View Assigned Courses by User</h3>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={viewUserId}
                    onChange={(e) => setViewUserId(e.target.value)}
                >
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </div>

            {viewUserId && (
                <>
                    {viewedCourses.length === 0 ? (
                        <p>No courses assigned to this user.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Course Code</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewedCourses.map((course) => (
                                    <tr key={course.courseId}>
                                        <td>{course.courseName}</td>
                                        <td>{course.courseCode}</td>
                                        <td>{course.courseRating}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    handleUnassign(viewUserId, course.courseId)
                                                }
                                            >
                                                Unassign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminCourses;
