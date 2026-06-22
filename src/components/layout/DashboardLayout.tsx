import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { LayoutDashboard, Users, FilePlus, LogOut, HeartPulse, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../lib/theme';
import { motion } from 'motion/react';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { currentDentist, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/odontosign/login');
    };

    if (!currentDentist) {
        return <>{children}</>;
    }

    const navItems = [
        { path: '/odontosign/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/odontosign/patients', icon: Users, label: 'Pacientes' },
        { path: '/odontosign/new-form', icon: FilePlus, label: 'Novo Formulário' },
    ];

    const themeIcons = { light: Sun, dark: Moon, system: Monitor };
    const ThemeIcon = themeIcons[theme];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-border hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-2">
                    <HeartPulse className="text-primary w-8 h-8" />
                    <span className="font-bold text-xl tracking-tight text-foreground">OdontoSign</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="bg-muted p-3 rounded-lg mb-4">
                        <p className="text-xs text-muted-foreground">Dentista Responsável</p>
                        <p className="font-semibold text-sm truncate text-foreground">{currentDentist.name}</p>
                        <p className="text-[10px] text-muted-foreground italic">CRO: {currentDentist.cro}</p>
                    </div>

                    <div className="flex gap-1 mb-2 p-1 bg-muted rounded-lg">
                        {(["light", "dark", "system"] as const).map((t) => {
                            const Icon = themeIcons[t];
                            return (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        theme === t
                                            ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Icon size={14} />
                                </button>
                            );
                        })}
                    </div>

                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={handleLogout}>
                        <LogOut size={20} />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-auto">
                <header className="h-16 px-8 border-b border-border bg-white dark:bg-slate-900 flex items-center justify-between md:justify-end">
                    <div className="md:hidden flex items-center gap-2">
                        <HeartPulse className="text-primary w-6 h-6" />
                        <span className="font-bold text-foreground">OdontoSign</span>
                    </div>

                    {/* Mobile nav */}
                    <nav className="md:hidden flex gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`p-2 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                <item.icon size={20} />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                        >
                            <ThemeIcon size={18} />
                        </button>
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-medium text-foreground">{currentDentist.clinicName || 'Minha Clínica'}</p>
                            <p className="text-[10px] text-muted-foreground">Plano Premium</p>
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
