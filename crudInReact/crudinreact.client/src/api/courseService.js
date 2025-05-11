// This file allows you to configure ESLint according to your project's needs, so that you
// can control the strictness of the linter, the plugins to use, and more.

// For more information about configuring ESLint, visit https://eslint.org/docs/user-guide/configuring/

const BASE_URL = '/api/courses';

export const getCourses = async () => {
    const res = await fetch(BASE_URL);
    return await res.json();
};

export const createCourse = async (course) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    return await res.json();
};

export const updateCourse = async (id, course) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    return await res.json();
};

export const deleteCourse = async (id) => {
    return await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
};
