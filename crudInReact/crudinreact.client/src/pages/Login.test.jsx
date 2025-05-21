import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock axios
jest.mock('axios');

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderLogin = () =>
        render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );

    test('renders username, password inputs and login button', () => {
        renderLogin();

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('allows user to type username and password', () => {
        renderLogin();

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpass' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('testpass');
    });

    test('shows loading state on submit and disables inputs/button', async () => {
        axios.post.mockResolvedValue({
            data: { token: 'fake-token', isAdmin: false },
        });

        renderLogin();

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpass' } });

        fireEvent.click(loginButton);

        expect(loginButton).toBeDisabled();
        expect(usernameInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('https://localhost:7226/api/User/login', {
                username: 'testuser',
                password: 'testpass',
            });
        });
    });

    test('calls login from context and navigates on successful admin login', async () => {
        axios.post.mockResolvedValue({
            data: { token: 'fake-token', isAdmin: true },
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'adminuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'adminpass' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('fake-token', true);
            expect(mockedNavigate).toHaveBeenCalledWith('/admin');
        });
    });

    test('calls login from context and navigates on successful regular user login', async () => {
        axios.post.mockResolvedValue({
            data: { token: 'fake-token', isAdmin: false },
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'normaluser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'normalpass' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('fake-token', false);
            expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('alerts user on login failure', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        window.alert = jest.fn();

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'failuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'failpass' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Login failed');
        });
    });
});
