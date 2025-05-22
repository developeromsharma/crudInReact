import React from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import AdminCourses from './AdminCourses';
import { vi } from 'vitest';
import * as courseService from '../api/courseService';
import * as assignmentService from '../api/assignmentService';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Mock API modules
vi.mock('../api/courseService', () => ({
    getCourses: vi.fn(),
    createCourse: vi.fn(),
    updateCourse: vi.fn(),
    deleteCourse: vi.fn(),
}));

vi.mock('../api/assignmentService', () => ({
    assignCourseToUser: vi.fn(),
    unassignCourseFromUser: vi.fn(),
    getAssignedCourses: vi.fn(),
}));

vi.mock('axios');

describe('AdminCourses Component', () => {
    const mockToken = 'mock-token';
    const mockUsers = [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' },
    ];

    const mockCourses = {
        data: {
            data: [
                { courseId: 1, courseName: 'Math', courseCode: 'M101', courseRating: 4.5 },
                { courseId: 2, courseName: 'Physics', courseCode: 'P101', courseRating: 4.2 },
            ],
        },
    };

    const mockAssignments = {
        data: {
            data: [],
        },
    };

    const renderComponent = () =>
        render(
            <AuthContext.Provider value={{ token: mockToken }}>
                <AdminCourses />
            </AuthContext.Provider>
        );

    beforeEach(() => {
        vi.clearAllMocks();

        courseService.getCourses.mockResolvedValue(mockCourses);
        axios.get.mockImplementation((url) => {
            if (url.includes('non-admin')) {
                return Promise.resolve({ data: { data: mockUsers } });
            }
            if (url.includes('my-courses')) {
                return Promise.resolve(mockAssignments);
            }
            return Promise.resolve({ data: { data: [] } });
        });

        assignmentService.getAssignedCourses.mockResolvedValue({ data: { data: [] } });
    });

    it('renders without crashing and shows course table', async () => {
        renderComponent();

        await waitFor(() => {
            const table = screen.getByRole('table');
            const { getByText } = within(table);
            expect(getByText('Math')).toBeInTheDocument();
            expect(getByText('Physics')).toBeInTheDocument();
        });
    });


    it('can fill form and call createCourse', async () => {
        renderComponent();

        await waitFor(() => screen.getByPlaceholderText('Name'));

        fireEvent.change(screen.getByPlaceholderText('Name'), {
            target: { value: 'Biology' },
        });
        fireEvent.change(screen.getByPlaceholderText('Code'), {
            target: { value: 'B101' },
        });
        fireEvent.change(screen.getByPlaceholderText('Rating'), {
            target: { value: '4.0' },
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(courseService.createCourse).toHaveBeenCalledWith({
                courseName: 'Biology',
                courseCode: 'B101',
                courseRating: 4.0,
            });
        });
    });

    it('can assign course to user', async () => {
        renderComponent();

        await waitFor(() => screen.getByText('Assign Course to User'));

        const userSelect = screen.getAllByDisplayValue('Select User')[0];
        const courseSelect = screen.getAllByDisplayValue('Select Course')[0];

        fireEvent.change(userSelect, {
            target: { value: '1' },
        });
        fireEvent.change(courseSelect, {
            target: { value: '1' },
        });

        fireEvent.click(screen.getByRole('button', { name: /assign/i }));

        await waitFor(() => {
            expect(assignmentService.assignCourseToUser).toHaveBeenCalledWith('1', 1);
        });
    });
});
