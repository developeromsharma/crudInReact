import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import UserDashboard from '../pages/UserDashboard';
import { AuthContext } from '../context/AuthContext';
import * as courseService from '../api/courseService';
import * as assignmentService from '../api/assignmentService';

// Mock API calls
vi.mock('../api/courseService');
vi.mock('../api/assignmentService');

describe('UserDashboard component', () => {
    const user = { userName: 'JohnDoe' };

    const renderWithContext = (token = 'fake-token') => {
        render(
            <AuthContext.Provider value={{ token, user }}>
                <UserDashboard />
            </AuthContext.Provider>
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows login prompt if no token', () => {
        renderWithContext(null);
        expect(screen.getByText(/please login/i)).toBeInTheDocument();
    });

    it('shows loading messages initially', async () => {
        courseService.getCourses.mockReturnValue(new Promise(() => { }));
        assignmentService.getAssignedCourses.mockReturnValue(new Promise(() => { }));

        renderWithContext();

        expect(screen.getByText(/loading assigned courses/i)).toBeInTheDocument();
        expect(screen.getByText(/loading all courses/i)).toBeInTheDocument();
    });

    it('renders assigned courses table with data', async () => {
        assignmentService.getAssignedCourses.mockResolvedValue({
            data: {
                data: [
                    {
                        courseId: 1,
                        courseName: 'Assigned Course 1',
                        courseCode: 'AC1',
                        courseRating: 4.5,
                    },
                ],
            },
        });

        courseService.getCourses.mockResolvedValue({
            data: { data: [] },
        });

        renderWithContext();

        // Wait for assigned courses to load
        await waitFor(() => {
            expect(screen.queryByText(/loading assigned courses/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText('Assigned Course 1')).toBeInTheDocument();
        expect(screen.getByText('AC1')).toBeInTheDocument();
        expect(screen.getByText('4.5')).toBeInTheDocument();

        // Since allCourses is empty, show no courses message
        expect(screen.getByText(/no courses available/i)).toBeInTheDocument();
    });

    it('renders all courses table with data', async () => {
        assignmentService.getAssignedCourses.mockResolvedValue({
            data: { data: [] },
        });

        courseService.getCourses.mockResolvedValue({
            data: {
                data: [
                    {
                        courseId: 10,
                        courseName: 'Course 10',
                        courseCode: 'C10',
                        courseRating: 3.8,
                    },
                ],
            },
        });

        renderWithContext();

        // Wait for all courses to load
        await waitFor(() => {
            expect(screen.queryByText(/loading all courses/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText('Course 10')).toBeInTheDocument();
        expect(screen.getByText('C10')).toBeInTheDocument();
        expect(screen.getByText('3.8')).toBeInTheDocument();

        // Since assignedCourses is empty, show no assigned courses message
        expect(screen.getByText(/no course assigned/i)).toBeInTheDocument();
    });

    it('handles errors gracefully and stops loading', async () => {
        // Mock rejected promises
        assignmentService.getAssignedCourses.mockRejectedValue(new Error('Failed to fetch assigned'));
        courseService.getCourses.mockRejectedValue(new Error('Failed to fetch all courses'));

        // spy on console.error to suppress error logs in test output
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        renderWithContext();

        await waitFor(() => {
            expect(screen.queryByText(/loading assigned courses/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/loading all courses/i)).not.toBeInTheDocument();
        });

        // No courses loaded, so fallback messages appear
        expect(screen.getByText(/no course assigned/i)).toBeInTheDocument();
        expect(screen.getByText(/no courses available/i)).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
});
