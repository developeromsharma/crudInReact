import React, { useEffect, useState } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseService';

const CourseCrud = () => {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ courseName: '', courseCode: '', courseRating: '' });
    const [editId, setEditId] = useState(null);

    const loadCourses = async () => {
        const data = await getCourses();
        setCourses(data);
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await updateCourse(editId, form);
            setEditId(null);
        } else {
            await createCourse(form);
        }
        setForm({ courseName: '', courseCode: '', courseRating: '' });
        loadCourses();
    };

    const handleEdit = (course) => {
        setForm(course);
        setEditId(course.courseId);
    };

    const handleDelete = async (id) => {
        await deleteCourse(id);
        loadCourses();
    };

    return (
        <div>
            <h2>Course CRUD</h2>
            <form onSubmit={handleSubmit}>
                <input name="courseName" value={form.courseName} onChange={handleChange} placeholder="Name" required />
                <input name="courseCode" value={form.courseCode} onChange={handleChange} placeholder="Code" required />
                <input name="courseRating" value={form.courseRating} onChange={handleChange} placeholder="Rating" type="number" step="0.1" required />
                <button type="submit">{editId ? 'Update' : 'Add'} Course</button>
            </form>
            <ul>
                {courses.map(course => (
                    <li key={course.courseId}>
                        {course.courseName} - {course.courseCode} - {course.courseRating}
                        <button onClick={() => handleEdit(course)}>Edit</button>
                        <button onClick={() => handleDelete(course.courseId)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseCrud;
