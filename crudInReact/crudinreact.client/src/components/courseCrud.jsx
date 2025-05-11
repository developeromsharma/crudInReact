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

        if (!form.courseName || !form.courseCode || !form.courseRating) {
            alert('Please fill in all fields.');
            return;
        }

        // Prepare the course object with the correct data types
        const preparedCourse = {
            ...form,
            courseRating: parseFloat(form.courseRating),
            courseId: editId 
        };

        if (editId) {
            await updateCourse(editId, preparedCourse);  // <-- now sending correctly formatted data
            alert('Course updated successfully!');
            setEditId(null);
        } else {
            await createCourse(preparedCourse);
            alert('Course created successfully!');
        }

        setForm({ courseName: '', courseCode: '', courseRating: '' });
        loadCourses();
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
            await deleteCourse(id);
            loadCourses();
            alert('Course deleted successfully!');
        }
    };

    return (
        <div className="container mt-4">
            
            <form onSubmit={handleSubmit} className="d-flex justify-content-center my-3">
                <input
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="form-control mx-1"
                    required
                />
                <input
                    name="courseCode"
                    value={form.courseCode}
                    onChange={handleChange}
                    placeholder="Code"
                    className="form-control mx-1"
                    required
                />
                <input
                    name="courseRating"
                    value={form.courseRating}
                    onChange={handleChange}
                    placeholder="Rating"
                    type="number"
                    step="0.1"
                    className="form-control mx-1"
                    required
                />
                <button type="submit" className={`btn ${editId ? 'btn-success' : 'btn-primary'} mx-1`}>
                    {editId ? 'Update' : 'Add'} Course
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
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <tr key={course.courseId}>
                                <td>{course.courseName}</td>
                                <td>{course.courseCode}</td>
                                <td>{course.courseRating}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(course)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(course.courseId)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No courses found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CourseCrud;
