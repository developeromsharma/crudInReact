import React, { useEffect, useState, useContext } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseService';
import { AuthContext } from '../context/AuthContext';

const CourseCrud = () => {
    const { token, isAdmin, logout } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ courseName: '', courseCode: '', courseRating: '' });
    const [editId, setEditId] = useState(null);

    const loadCourses = async () => {
        try {
            const data = await getCourses();
            setCourses(data);
        } catch (err) {
            console.error("Error loading courses:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        if (token) loadCourses();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.courseName || !form.courseCode || !form.courseRating) {
            alert('Please fill in all fields.');
            return;
        }

        const course = {
            ...form,
            courseRating: parseFloat(form.courseRating),
            courseId: editId
        };

        try {
            if (editId) {
                await updateCourse(editId, course);
                alert('Course updated successfully!');
                setEditId(null);
            } else {
                await createCourse(course);
                alert('Course created successfully!');
            }
            setForm({ courseName: '', courseCode: '', courseRating: '' });
            loadCourses();
        } catch (error) {
            alert('Error saving course. Check console for details.');
            console.error(error);
        }
    };

    const handleEdit = (course) => {
        setForm({
            courseName: course.courseName,
            courseCode: course.courseCode,
            courseRating: course.courseRating
        });
        setEditId(course.courseId);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(id);
                loadCourses();
                alert('Course deleted successfully!');
            } catch (err) {
                alert('Failed to delete course.');
                console.error(err);
            }
        }
    };

    if (!token) return <div className="text-center mt-5">Loading or Unauthorized. Please login.</div>;

    return (
        <div className="container mt-5">
             {isAdmin && (
                <form onSubmit={handleSubmit} className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4">
                    <input
                        name="courseName"
                        value={form.courseName}
                        onChange={handleChange}
                        placeholder="Course Name"
                        className="form-control"
                        style={{ maxWidth: '200px' }}
                        required
                    />
                    <input
                        name="courseCode"
                        value={form.courseCode}
                        onChange={handleChange}
                        placeholder="Course Code"
                        className="form-control"
                        style={{ maxWidth: '200px' }}
                        required
                    />
                    <input
                        name="courseRating"
                        value={form.courseRating}
                        onChange={handleChange}
                        placeholder="Rating"
                        type="number"
                        step="0.1"
                        className="form-control"
                        style={{ maxWidth: '150px' }}
                        required
                    />
                    <button type="submit" className={`btn ${editId ? 'btn-success' : 'btn-primary'}`}>
                        {editId ? 'Update' : 'Add'} Course
                    </button>
                </form>

            )}

            <div className="table-responsive">
                <table className="table table-bordered table-hover text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Rating</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course.courseId}>
                                    <td>{course.courseName}</td>
                                    <td>{course.courseCode}</td>
                                    <td>{course.courseRating}</td>
                                    {isAdmin && (
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
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 4 : 3}>No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseCrud;
