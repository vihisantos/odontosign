import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
    const [name, setName] = useState('');
    const [cro, setCro] = useState('');
    const setDentist = useStore((state) => state.setDentist);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && cro) {
            setDentist({
                id: crypto.randomUUID(),
                name,
                cro,
                clinicName: 'Clinica Premium ' + name.split(' ')[0]
            });
            navigate('/odontosign/');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-8 relative z-10"
            >
                <HeartPulse className="text-primary w-10 h-10" />
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">OdontoSign</h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center text-foreground">Acesso do Dentista</CardTitle>
                        <CardDescription className="text-center">
                            Insira suas credenciais para gerenciar seus termos digitais.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="name">Nome Completo</label>
                                <Input
                                    id="name"
                                    placeholder="Dr. João Silva"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="cro">Número do CRO</label>
                                <Input
                                    id="cro"
                                    placeholder="12345/UF"
                                    value={cro}
                                    onChange={(e) => setCro(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full text-base py-6" type="submit">Entrar no Painel</Button>
                            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                                <ShieldCheck size={14} />
                                Ambiente Seguro e Criptografado
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-sm text-muted-foreground max-w-xs text-center relative z-10"
            >
                Versão de Demonstração (MVP). <br /> Todos os dados são salvos localmente no seu computador.
            </motion.p>
        </div>
    );
}
