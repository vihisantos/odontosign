import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Copy, ExternalLink, Send, FileText, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function NewForm() {
    const { patients, addForm } = useStore();
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        if (!selectedPatientId) return;

        const formId = crypto.randomUUID();
        addForm({
            id: formId,
            patientId: selectedPatientId,
            templateId: 'consent-base-1',
            status: 'pending',
            sentAt: new Date().toISOString()
        });

        const link = `${window.location.origin}/odontosign/sign/${formId}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        const patient = patients.find(p => p.id === selectedPatientId);
        if (!patient) return;

        const message = encodeURIComponent(
            `Olá ${patient.name.split(' ')[0]}, aqui está o Termo de Consentimento para sua consulta na ${useStore.getState().currentDentist?.clinicName || 'clínica'}.\n\nPor favor, acesse e assine digitalmente: ${generatedLink}`
        );
        const url = `https://wa.me/55${patient.phone.replace(/\D/g, '')}?text=${message}`;
        window.open(url, '_blank');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight">Novo Formulário</h2>
                <p className="text-muted-foreground mt-1">Gere um link seguro para o seu paciente assinar.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground">Configurar Envio</CardTitle>
                        <CardDescription>Selecione o paciente e o tipo de termo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">1. Selecionar Paciente</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                            >
                                <option value="">Escolha um paciente...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.cpf})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">2. Tipo de Documento</label>
                            <div className="p-4 border border-border rounded-lg bg-muted flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-primary w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Termo de Consentimento Livre e Esclarecido</p>
                                        <p className="text-xs text-muted-foreground">Padrão odontológico básico v1.0</p>
                                    </div>
                                </div>
                                <CheckCircle2 className="text-green-500 w-5 h-5" />
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2 py-6 text-base"
                            disabled={!selectedPatientId || !!generatedLink}
                            onClick={handleGenerate}
                        >
                            <Send size={18} />
                            Gerar Link de Assinatura
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {generatedLink && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/30">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                                <CheckCircle2 size={20} />
                                Link Gerado com Sucesso!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Compartilhe o link abaixo com seu paciente via WhatsApp ou E-mail.
                            </p>
                            <div className="flex gap-2">
                                <Input value={generatedLink} readOnly className="bg-white dark:bg-slate-900" />
                                <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
                                    {copied ? <CheckCircle2 className="text-green-500" /> : <Copy size={18} />}
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button
                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={shareWhatsApp}
                                >
                                    <MessageSquare size={18} />
                                    Enviar WhatsApp
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 text-muted-foreground"
                                    onClick={() => window.open(generatedLink, '_blank')}
                                >
                                    <ExternalLink size={14} />
                                    Testar Link
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
