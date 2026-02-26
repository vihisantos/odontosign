import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import NewForm from './pages/NewForm';
import SignForm from './pages/SignForm';
import { DashboardLayout } from './components/layout/DashboardLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const currentDentist = useStore((state) => state.currentDentist);
    if (!currentDentist) return <Navigate to="/login" replace />;
    return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
    return (
        <BrowserRouter basename="/odontosign">
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patients"
                    element={
                        <ProtectedRoute>
                            <Patients />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/new-form"
                    element={
                        <ProtectedRoute>
                            <NewForm />
                        </ProtectedRoute>
                    }
                />

                {/* Patient Signature Route (Public) */}
                <Route path="/sign/:id" element={<SignForm />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
