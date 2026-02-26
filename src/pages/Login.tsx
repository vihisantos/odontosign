import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeartPulse, ShieldCheck } from 'lucide-react';

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
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <HeartPulse className="text-primary w-10 h-10" />
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">OdontoSign</h1>
            </div>

            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Acesso do Dentista</CardTitle>
                    <CardDescription className="text-center">
                        Insira suas credenciais para gerenciar seus termos digitais.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">Nome Completo</label>
                            <Input
                                id="name"
                                placeholder="Dr. João Silva"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="cro">Número do CRO</label>
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
                        <div className="flex items-center gap-2 justify-center text-xs text-neutral-400">
                            <ShieldCheck size={14} />
                            Ambiente Seguro e Criptografado
                        </div>
                    </CardFooter>
                </form>
            </Card>

            <p className="mt-8 text-sm text-neutral-500 max-w-xs text-center">
                Versão de Demonstração (MVP). <br /> Todos os dados são salvos localmente no seu computador.
            </p>
        </div>
    );
}
