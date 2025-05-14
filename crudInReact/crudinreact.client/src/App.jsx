import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CourseCrud from './pages/CourseCrud';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function AppContent() {
    const location = useLocation();

    // Hide Navbar on login page
    const hideNavbar = location.pathname === '/login';

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <CourseCrud />
                    </ProtectedRoute>
                } />
                <Route path="/courses" element={
                    <ProtectedRoute>
                        <CourseCrud />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                        <CourseCrud />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
