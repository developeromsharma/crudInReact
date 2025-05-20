import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PAGE_SIZE = 5;

const UserCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        handleFilter(search);
    }, [search, courses]);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://localhost:7122/api/course/my-courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCourses(res.data.data || []);
            setFilteredCourses(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        }
    };

    const handleFilter = (text) => {
        const filtered = courses.filter(c =>
            c.courseName.toLowerCase().includes(text.toLowerCase()) ||
            c.courseCode.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCourses(filtered);
        setCurrentPage(1);
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + PAGE_SIZE);
    const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>

            <input
                type="text"
                placeholder="Search by name or code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 mb-4 w-full max-w-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedCourses.map(course => (
                    <div key={course.courseId} className="border p-4 rounded shadow">
                        <h3 className="text-xl font-semibold">{course.courseName}</h3>
                        <p>Code: {course.courseCode}</p>
                        <p>Rating: {course.courseRating}</p>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserCoursesPage;
