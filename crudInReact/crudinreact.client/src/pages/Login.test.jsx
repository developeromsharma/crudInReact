import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
vi.mock('axios');

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login component', () => {
    const loginMock = vi.fn();

    const renderLogin = () => {
        render(
            <AuthContext.Provider value={{ login: loginMock }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders username and password inputs and login button', () => {
        renderLogin();

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('enables inputs and button initially', () => {
        renderLogin();

        expect(screen.getByPlaceholderText(/username/i)).toBeEnabled();
        expect(screen.getByPlaceholderText(/password/i)).toBeEnabled();
        expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
    });

    it('disables inputs and button when loading', async () => {
        renderLogin();

        // Mock axios.post to delay to simulate loading
        axios.post.mockImplementation(() =>
            new Promise((resolve) => setTimeout(() => resolve({ data: { token: 'abc', isAdmin: false } }), 100))
        );

        userEvent.type(screen.getByPlaceholderText(/username/i), 'testuser');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');

        userEvent.click(screen.getByRole('button', { name: /login/i }));

        // Check that inputs and button are disabled immediately
        expect(screen.getByPlaceholderText(/username/i)).toBeDisabled();
        expect(screen.getByPlaceholderText(/password/i)).toBeDisabled();
        expect(screen.getByRole('button')).toBeDisabled();

        // Wait for axios call to resolve and loading to end
        await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Login'));
    });

    it('calls login and navigates to /dashboard on successful login (non-admin)', async () => {
        renderLogin();

        axios.post.mockResolvedValueOnce({ data: { token: 'token123', isAdmin: false } });

        userEvent.type(screen.getByPlaceholderText(/username/i), 'user1');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'pass1');
        userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith('token123', false);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('calls login and navigates to /admin on successful login (admin)', async () => {
        renderLogin();

        axios.post.mockResolvedValueOnce({ data: { token: 'token123', isAdmin: true } });

        userEvent.type(screen.getByPlaceholderText(/username/i), 'admin');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'adminpass');
        userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith('token123', true);
            expect(mockNavigate).toHaveBeenCalledWith('/admin');
        });
    });

    it('shows alert on login failure', async () => {
        renderLogin();

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

        axios.post.mockRejectedValueOnce(new Error('Network error'));

        userEvent.type(screen.getByPlaceholderText(/username/i), 'failuser');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'failpass');
        userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('Login failed');
            alertMock.mockRestore();
        });
    });
});
