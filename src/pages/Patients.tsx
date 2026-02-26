import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Trash2, UserPlus, Phone, Mail, Fingerprint } from 'lucide-react';
import { format } from 'date-fns';

export default function Patients() {
    const { patients, addPatient, removePatient } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const [newPatient, setNewPatient] = useState({
        name: '',
        cpf: '',
        email: '',
        phone: ''
    });

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm)
    );

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        addPatient({
            ...newPatient,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        });
        setNewPatient({ name: '', cpf: '', email: '', phone: '' });
        setShowAddForm(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 leading-tight">Pacientes</h2>
                    <p className="text-neutral-500 mt-1">Gerencie a base de dados dos seus pacientes.</p>
                </div>
                <Button onClick={() => setShowAddForm(true)} className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus size={18} />
                    Novo Paciente
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <Input
                    placeholder="Buscar por nome ou CPF..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showAddForm && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg">Cadastrar Novo Paciente</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleAddPatient}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome Completo</label>
                                <Input value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} required placeholder="Ex: Maria Oliveira" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CPF</label>
                                <Input value={newPatient.cpf} onChange={e => setNewPatient({ ...newPatient, cpf: e.target.value })} required placeholder="000.000.000-00" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">E-mail</label>
                                <Input type="email" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} required placeholder="maria@email.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefone / WhatsApp</label>
                                <Input value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} required placeholder="(00) 00000-0000" />
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex gap-2 justify-end">
                            <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                            <Button type="submit">Salvar Paciente</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <CardContent className="p-0">
                    {filteredPatients.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-neutral-400 space-y-4">
                            <UserPlus size={48} strokeWidth={1} />
                            <p>Nenhum paciente encontrado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-neutral-50/50 border-b">
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-neutral-500 tracking-wider">Paciente</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-neutral-500 tracking-wider">Documento</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-neutral-500 tracking-wider">Contato</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-neutral-500 tracking-wider">Cadastro</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-neutral-500 tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredPatients.map((p) => (
                                        <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-neutral-900">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                    <Fingerprint size={14} className="text-neutral-400" />
                                                    {p.cpf}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                                    <Mail size={12} className="text-neutral-400" />
                                                    {p.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                                    <Phone size={12} className="text-neutral-400" />
                                                    {p.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-600">{format(new Date(p.createdAt), 'dd/MM/yyyy')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-neutral-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => removePatient(p.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
