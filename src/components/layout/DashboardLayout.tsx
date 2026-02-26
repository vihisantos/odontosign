import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { LayoutDashboard, Users, FilePlus, LogOut, HeartPulse } from 'lucide-react';
import { Button } from '../ui/button';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { currentDentist, logout } = useStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentDentist) {
        return <>{children}</>; // Fallback if handled elsewhere
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-2">
                    <HeartPulse className="text-primary w-8 h-8" />
                    <span className="font-bold text-xl tracking-tight">OdontoSign</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/patients" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors">
                        <Users size={20} />
                        <span className="font-medium">Pacientes</span>
                    </Link>
                    <Link to="/new-form" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors">
                        <FilePlus size={20} />
                        <span className="font-medium">Novo Formulário</span>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <div className="bg-neutral-50 p-3 rounded-lg mb-4">
                        <p className="text-xs text-neutral-500">Dentista Responsável</p>
                        <p className="font-semibold text-sm truncate">{currentDentist.name}</p>
                        <p className="text-[10px] text-neutral-400 italic">CRO: {currentDentist.cro}</p>
                    </div>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut size={20} />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-auto">
                <header className="h-16 px-8 border-b bg-white flex items-center justify-between md:justify-end">
                    <div className="md:hidden flex items-center gap-2">
                        <HeartPulse className="text-primary w-6 h-6" />
                        <span className="font-bold">OdontoSign</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-medium">{currentDentist.clinicName || 'Minha Clínica'}</p>
                            <p className="text-[10px] text-neutral-400">Plano Premium</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {currentDentist.name.charAt(0)}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
