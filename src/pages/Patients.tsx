import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Trash2, UserPlus, Phone, Mail, Fingerprint } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

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
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight">Pacientes</h2>
                    <p className="text-muted-foreground mt-1">Gerencie a base de dados dos seus pacientes.</p>
                </div>
                <Button onClick={() => setShowAddForm(true)} className="gap-2">
                    <Plus size={18} />
                    Novo Paciente
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome ou CPF..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg text-foreground">Cadastrar Novo Paciente</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleAddPatient}>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Nome Completo</label>
                                    <Input value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} required placeholder="Ex: Maria Oliveira" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">CPF</label>
                                    <Input value={newPatient.cpf} onChange={e => setNewPatient({ ...newPatient, cpf: e.target.value })} required placeholder="000.000.000-00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">E-mail</label>
                                    <Input type="email" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} required placeholder="maria@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Telefone / WhatsApp</label>
                                    <Input value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} required placeholder="(00) 00000-0000" />
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0 flex gap-2 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                                <Button type="submit">Salvar Paciente</Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardContent className="p-0">
                    {filteredPatients.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <UserPlus size={48} strokeWidth={1} />
                            <p>Nenhum paciente encontrado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-border">
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider">Paciente</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider">Documento</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider">Contato</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider">Cadastro</th>
                                        <th className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredPatients.map((p, i) => (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-foreground">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Fingerprint size={14} className="text-muted-foreground" />
                                                    {p.cpf}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Mail size={12} className="text-muted-foreground" />
                                                    {p.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Phone size={12} className="text-muted-foreground" />
                                                    {p.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-muted-foreground">{format(new Date(p.createdAt), 'dd/MM/yyyy')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                    onClick={() => removePatient(p.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </td>
                                        </motion.tr>
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
