import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import AdminCourses from './pages/AdminCourses';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import { useContext } from 'react';
import HeaderBanner from './components/HeaderBanner';
import Breadcrumbs from './components/Breadcrumbs';

function AppContent() {
    const location = useLocation();
    const { isAdmin } = useContext(AuthContext);

    const hideNavbar = location.pathname === '/login';

    return (
        <>
            {/* HeaderBanner is always shown */}
            <HeaderBanner />

            {/* Navbar is conditionally shown */}
            {!hideNavbar && <Navbar />}
            {!hideNavbar && <Breadcrumbs />} 

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><AdminCourses /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute>{isAdmin ? <AdminCourses /> : <UserDashboard />}</ProtectedRoute>} />
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
