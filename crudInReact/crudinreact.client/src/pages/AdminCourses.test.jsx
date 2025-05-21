import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminCourses from '../components/AdminCourses';
import * as courseService from '../api/courseService';
import * as assignmentService from '../api/assignmentService';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Mock axios and api calls
jest.mock('axios');
jest.mock('../api/courseService');
jest.mock('../api/assignmentService');

const mockCourses = [
    { courseId: 1, courseName: 'React Basics', courseCode: 'REACT101', courseRating: 4.5 },
    { courseId: 2, courseName: 'Advanced JS', courseCode: 'JS201', courseRating: 4.7 },
];

const mockUsers = [
    { id: 10, username: 'user1' },
    { id: 20, username: 'user2' },
];

const mockUserCourses = [
    { userId: 10, courses: [mockCourses[0]] }
];

describe('AdminCourses Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock course service API
        courseService.getCourses.mockResolvedValue({ data: { data: mockCourses } });
        courseService.createCourse.mockResolvedValue({});
        courseService.updateCourse.mockResolvedValue({});
        courseService.deleteCourse.mockResolvedValue({});

        // Mock assignment service API
        assignmentService.assignCourseToUser.mockResolvedValue({});
        assignmentService.unassignCourseFromUser.mockResolvedValue({});
        assignmentService.getAssignedCourses.mockImplementation((userId) => {
            const userCourses = mockUserCourses.find(uc => uc.userId === Number(userId));
            return Promise.resolve({ data: { data: userCourses ? userCourses.courses : [] } });
        });

        // Mock axios calls for non-admin users and user-course map
        axios.get.mockImplementation((url) => {
            if (url.endsWith('/api/user/non-admin')) {
                return Promise.resolve({ data: { data: mockUsers } });
            }
            if (url.endsWith('/api/assignment/my-courses')) {
                return Promise.resolve({ data: { data: mockUserCourses } });
            }
            return Promise.reject(new Error('not found'));
        });
    });

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={{ token: 'fake-token' }}>
                <AdminCourses />
            </AuthContext.Provider>
        );
    };

    test('renders component and loads courses and users', async () => {
        renderComponent();

        expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();

        // Wait for courses and users to load and appear
        await waitFor(() => {
            expect(courseService.getCourses).toHaveBeenCalled();
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/api/user/non-admin'),
                expect.any(Object)
            );
        });

        // Check that courses appear in the table
        expect(screen.getByText('React Basics')).toBeInTheDocument();
        expect(screen.getByText('Advanced JS')).toBeInTheDocument();

        // Check users appear in the dropdown
        expect(screen.getAllByRole('option').some(opt => opt.textContent === 'user1')).toBe(true);
    });

    test('handles form submission to create a new course', async () => {
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'New Course' } });
        fireEvent.change(screen.getByPlaceholderText(/Code/i), { target: { value: 'NEW101' } });
        fireEvent.change(screen.getByPlaceholderText(/Rating/i), { target: { value: '4.0' } });

        fireEvent.click(screen.getByRole('button', { name: /Add/i }));

        await waitFor(() => {
            expect(courseService.createCourse).toHaveBeenCalledWith({
                courseName: 'New Course',
                courseCode: 'NEW101',
                courseRating: 4.0,
            });
        });
    });

    test('shows alert if form fields are empty on submit', () => {
        window.alert = jest.fn();

        renderComponent();

        fireEvent.click(screen.getByRole('button', { name: /Add/i }));

        expect(window.alert).toHaveBeenCalledWith('Fill in all fields.');
    });

    test('handles course assignment to user', async () => {
        window.alert = jest.fn();

        renderComponent();

        // Wait for data load
        await waitFor(() => expect(courseService.getCourses).toHaveBeenCalled());

        // Select user and course from dropdown
        fireEvent.change(screen.getByRole('combobox', { name: '' }), { target: { value: '10' } }); // user select
        fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: '1' } }); // course select

        fireEvent.click(screen.getByRole('button', { name: /Assign/i }));

        await waitFor(() => {
            expect(assignmentService.assignCourseToUser).toHaveBeenCalledWith('10', 1);
            expect(window.alert).toHaveBeenCalledWith('Course assigned successfully!');
        });
    });

    test('handles course unassignment from user', async () => {
        window.alert = jest.fn();
        window.confirm = jest.fn(() => true); // simulate confirm = yes

        renderComponent();

        // Set view user id to trigger courses load
        fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: '10' } });

        // Wait for courses to load
        await waitFor(() => screen.getByText('React Basics'));

        // Click unassign button
        fireEvent.click(screen.getByRole('button', { name: /Unassign/i }));

        await waitFor(() => {
            expect(assignmentService.unassignCourseFromUser).toHaveBeenCalledWith('10', 1);
            expect(window.alert).toHaveBeenCalledWith('Course unassigned successfully!');
        });
    });
});
