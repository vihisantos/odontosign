import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ThemeProvider } from './lib/theme';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const NewForm = lazy(() => import('./pages/NewForm'));
const SignForm = lazy(() => import('./pages/SignForm'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

function PageLoader() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Carregando...</p>
            </div>
        </div>
    );
}

function withSuspense(Component: React.ComponentType) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Component />
        </Suspense>
    );
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const currentDentist = useStore((state) => state.currentDentist);
    if (!currentDentist) return <Navigate to="/odontosign/login" replace />;
    return <DashboardLayout>{children}</DashboardLayout>;
};

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="min-h-screen"
            >
                <Routes location={location}>
                    <Route path="/login" element={withSuspense(Login)} />
                    <Route path="/" element={<ProtectedRoute>{withSuspense(Dashboard)}</ProtectedRoute>} />
                    <Route path="/patients" element={<ProtectedRoute>{withSuspense(Patients)}</ProtectedRoute>} />
                    <Route path="/new-form" element={<ProtectedRoute>{withSuspense(NewForm)}</ProtectedRoute>} />
                    <Route path="/sign/:id" element={withSuspense(SignForm)} />
                    <Route path="*" element={<Navigate to="/odontosign/" replace />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter basename="/odontosign">
                <AnimatedRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
