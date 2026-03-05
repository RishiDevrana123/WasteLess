import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pantry from './pages/Pantry';
import Scanner from './pages/Scanner';
import Recipes from './pages/Recipes';
import Donations from './pages/Donations';

import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-green-500/30 selection:text-green-200 relative">
            {/* Global Gradient Background - Applied to whole website */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/pantry" /> : <Login />}
                    />
                    <Route
                        path="/signup"
                        element={user ? <Navigate to="/pantry" /> : <Signup />}
                    />

                    <Route
                        path="/pantry"
                        element={
                            <ProtectedRoute>
                                <Pantry />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/scanner"
                        element={
                            <ProtectedRoute>
                                <Scanner />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recipes"
                        element={
                            <ProtectedRoute>
                                <Recipes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/donations"
                        element={
                            <ProtectedRoute>
                                <Donations />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
