import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
    const { patients, forms } = useStore();

    const stats = [
        { title: 'Total Pacientes', icon: Users, value: patients.length, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Termos Enviados', icon: FileText, value: forms.length, color: 'text-purple-500', bg: 'bg-purple-50' },
        { title: 'Aguardando Assinatura', icon: Clock, value: forms.filter(f => f.status === 'pending').length, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Termos Assinados', icon: CheckCircle2, value: forms.filter(f => f.status === 'signed').length, color: 'text-green-500', bg: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 leading-tight">Painel de Controle</h2>
                <p className="text-neutral-500 mt-1">Bem-vindo assistente. Veja o status atual da sua clínica.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Card key={s.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500">{s.title}</span>
                            <div className={`${s.bg} p-2 rounded-lg`}>
                                <s.icon className={`${s.color} w-4 h-4`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{s.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Atividades Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {forms.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-neutral-400 text-sm">Nenhuma atividade registrada ainda.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {[...forms].reverse().slice(0, 5).map((form) => {
                                    const patient = patients.find(p => p.id === form.patientId);
                                    return (
                                        <div key={form.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${form.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {patient?.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate text-neutral-900">{patient?.name}</p>
                                                <p className="text-xs text-neutral-500 truncate">Gerou termo de consentimento</p>
                                            </div>
                                            <div className="text-right whitespace-nowrap">
                                                <p className="text-[10px] font-medium text-neutral-800">
                                                    {format(new Date(form.sentAt), "dd 'de' MMM", { locale: ptBR })}
                                                </p>
                                                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${form.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {form.status === 'signed' ? 'Assinado' : 'Pendente'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Pacientes Adicionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patients.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-neutral-400 text-sm">Nenhum paciente cadastrado.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[...patients].reverse().slice(0, 5).map((p) => (
                                    <div key={p.id} className="p-3 border rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                                            <p className="text-xs text-neutral-500">{p.phone}</p>
                                        </div>
                                        <div className="text-right text-[10px] text-neutral-400">
                                            Cadastrado em {format(new Date(p.createdAt), 'dd/MM/yy')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
