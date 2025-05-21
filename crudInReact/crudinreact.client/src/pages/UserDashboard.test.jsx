import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserDashboard from '../UserDashboard';
import { AuthContext } from '../../context/AuthContext';
import { getCourses } from '../../api/courseService';
import { getAssignedCourses } from '../../api/assignmentService';

// Mock API services
jest.mock('../../api/courseService', () => ({
    getCourses: jest.fn(),
}));

jest.mock('../../api/assignmentService', () => ({
    getAssignedCourses: jest.fn(),
}));

const mockAssignedCourses = [
    { courseId: 1, courseName: 'React Basics', courseCode: 'RB101', courseRating: 4.5 },
];
const mockAllCourses = [
    { courseId: 2, courseName: 'Node.js Fundamentals', courseCode: 'NJ102', courseRating: 4.8 },
];

const renderWithAuth = (token = 'valid-token', user = { userName: 'JohnDoe' }) => {
    return render(
        <AuthContext.Provider value={{ token, user }}>
            <UserDashboard />
        </AuthContext.Provider>
    );
};

describe('UserDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays login message if no token is present', () => {
        renderWithAuth(null);
        expect(screen.getByText(/please login/i)).toBeInTheDocument();
    });

    test('displays loading messages initially', async () => {
        getCourses.mockResolvedValue({ data: { data: [] } });
        getAssignedCourses.mockResolvedValue({ data: { data: [] } });

        renderWithAuth();

        expect(screen.getByText(/loading assigned courses/i)).toBeInTheDocument();
        expect(screen.getByText(/loading all courses/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(getCourses).toHaveBeenCalled();
            expect(getAssignedCourses).toHaveBeenCalled();
        });
    });

    test('shows message when no assigned or available courses', async () => {
        getCourses.mockResolvedValue({ data: { data: [] } });
        getAssignedCourses.mockResolvedValue({ data: { data: [] } });

        renderWithAuth();

        await waitFor(() => {
            expect(screen.getByText(/no course assigned/i)).toBeInTheDocument();
            expect(screen.getByText(/no courses available/i)).toBeInTheDocument();
        });
    });

    test('renders assigned and all courses tables correctly', async () => {
        getCourses.mockResolvedValue({ data: { data: mockAllCourses } });
        getAssignedCourses.mockResolvedValue({ data: { data: mockAssignedCourses } });

        renderWithAuth();

        await waitFor(() => {
            // Assigned Courses
            expect(screen.getByText('React Basics')).toBeInTheDocument();
            expect(screen.getByText('RB101')).toBeInTheDocument();
            expect(screen.getByText('4.5')).toBeInTheDocument();

            // All Courses
            expect(screen.getByText('Node.js Fundamentals')).toBeInTheDocument();
            expect(screen.getByText('NJ102')).toBeInTheDocument();
            expect(screen.getByText('4.8')).toBeInTheDocument();
        });
    });

    test('renders greeting with username', async () => {
        getCourses.mockResolvedValue({ data: { data: [] } });
        getAssignedCourses.mockResolvedValue({ data: { data: [] } });

        renderWithAuth();

        expect(screen.getByText(/hi johndoe, welcome to course dashboard/i)).toBeInTheDocument();
    });
});
