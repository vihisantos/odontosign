import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Copy, ExternalLink, Send, FileText } from 'lucide-react';

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

        // Mock direct link
        const link = `${window.location.origin}/odontosign/sign/${formId}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 leading-tight">Novo Formulário</h2>
                <p className="text-neutral-500 mt-1">Gere um link seguro para o seu paciente assinar.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Configurar Envio</CardTitle>
                    <CardDescription>Selecione o paciente e o tipo de termo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">1. Selecionar Paciente</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                        <label className="text-sm font-medium">2. Tipo de Documento</label>
                        <div className="p-4 border rounded-lg bg-neutral-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="text-primary w-5 h-5" />
                                <div>
                                    <p className="text-sm font-semibold">Termo de Consentimento Livre e Esclarecido</p>
                                    <p className="text-xs text-neutral-500">Padrão odontológico básico v1.0</p>
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

            {generatedLink && (
                <Card className="border-green-100 bg-green-50/30 animate-in zoom-in-95 duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={20} />
                            Link Gerado com Sucesso!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-neutral-600">
                            Compartilhe o link abaixo com seu paciente via WhatsApp ou E-mail.
                        </p>
                        <div className="flex gap-2">
                            <Input value={generatedLink} readOnly className="bg-white" />
                            <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
                                {copied ? <CheckCircle2 className="text-green-500" /> : <Copy size={18} />}
                            </Button>
                        </div>
                        <div className="flex justify-center pt-2">
                            <Button variant="link" className="gap-2 text-neutral-500 text-xs" onClick={() => window.open(generatedLink, '_blank')}>
                                <ExternalLink size={14} />
                                Testar Visualização do Paciente
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
