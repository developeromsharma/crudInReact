import React, { useEffect, useState, useContext } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseService';
import { AuthContext } from '../context/AuthContext';

const AdminCourses = () => {
    const { token } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ courseName: '', courseCode: '', courseRating: '' });
    const [editId, setEditId] = useState(null);
    const [originalCourse, setOriginalCourse] = useState(null);

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

    if (!token) return <div>Please login.</div>;

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
                <input name="courseName" value={form.courseName} onChange={handleChange} placeholder="Name" className="form-control" required />
                <input name="courseCode" value={form.courseCode} onChange={handleChange} placeholder="Code" className="form-control" required />
                <input name="courseRating" value={form.courseRating} onChange={handleChange} type="number" step="0.1" placeholder="Rating" className="form-control" required />
                <button type="submit" className={`btn ${editId ? 'btn-success' : 'btn-primary'}`}>
                    {editId ? 'Update' : 'Add'}
                </button>
            </form>

            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr><th>Name</th><th>Code</th><th>Rating</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseName}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.courseRating}</td>
                            <td>
                                <button className="btn btn-sm btn-warning mx-1" onClick={() => handleEdit(course)}>Edit</button>
                                <button className="btn btn-sm btn-danger mx-1" onClick={() => handleDelete(course.courseId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCourses;
