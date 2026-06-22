import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function Dashboard() {
    const { patients, forms } = useStore();

    const stats = [
        { title: 'Total Pacientes', icon: Users, value: patients.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
        { title: 'Termos Enviados', icon: FileText, value: forms.length, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
        { title: 'Aguardando Assinatura', icon: Clock, value: forms.filter(f => f.status === 'pending').length, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
        { title: 'Termos Assinados', icon: CheckCircle2, value: forms.filter(f => f.status === 'signed').length, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
    ];

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight">Painel de Controle</h2>
                <p className="text-muted-foreground mt-1">Bem-vindo assistente. Veja o status atual da sua clínica.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <span className="text-sm font-medium text-muted-foreground">{s.title}</span>
                                <div className={`${s.bg} p-2 rounded-lg`}>
                                    <s.icon className={`${s.color} w-4 h-4`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground">Atividades Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {forms.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
                                <p className="text-muted-foreground text-sm">Nenhuma atividade registrada ainda.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {[...forms].reverse().slice(0, 5).map((form, i) => {
                                    const patient = patients.find(p => p.id === form.patientId);
                                    return (
                                        <motion.div
                                            key={form.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${form.status === 'signed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
                                                {patient?.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate text-foreground">{patient?.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">Gerou termo de consentimento</p>
                                            </div>
                                            <div className="text-right whitespace-nowrap">
                                                <p className="text-[10px] font-medium text-foreground">
                                                    {format(new Date(form.sentAt), "dd 'de' MMM", { locale: ptBR })}
                                                </p>
                                                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${form.status === 'signed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
                                                    {form.status === 'signed' ? 'Assinado' : 'Pendente'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground">Pacientes Adicionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patients.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
                                <p className="text-muted-foreground text-sm">Nenhum paciente cadastrado.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[...patients].reverse().slice(0, 5).map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.phone}</p>
                                        </div>
                                        <div className="text-right text-[10px] text-muted-foreground">
                                            Cadastrado em {format(new Date(p.createdAt), 'dd/MM/yy')}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
