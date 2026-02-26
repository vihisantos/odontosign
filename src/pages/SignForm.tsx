import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import SignatureCanvas from 'react-signature-canvas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, CheckCircle2, ShieldCheck, AlertCircle, RotateCcw, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function SignForm() {
    const { id } = useParams();
    const { forms, patients, updateFormStatus } = useStore();
    const sigCanvas = useRef<SignatureCanvas>(null);

    const [form, setForm] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const currentForm = forms.find(f => f.id === id);
        if (currentForm) {
            setForm(currentForm);
            const currentPatient = patients.find(p => p.id === currentForm.patientId);
            setPatient(currentPatient);
        }
    }, [id, forms, patients]);

    const clear = () => sigCanvas.current?.clear();

    const handleSign = async () => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            alert('Por favor, desenhe sua assinatura no campo indicado.');
            return;
        }

        setLoading(true);

        try {
            const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

            // PDF Generation logic (hidden render)
            const element = document.getElementById('document-content');
            if (element) {
                // High quality scale for PDF
                const canvas = await html2canvas(element, { scale: 3 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                // Add signature to PDF footer area
                pdf.addImage(signatureData, 'PNG', 15, pdfHeight + 5, 50, 20);

                pdf.setFontSize(8);
                pdf.setTextColor(150);
                pdf.text(`Assinado digitalmente por ${patient.name} em: ${new Date().toLocaleString('pt-BR')}`, 15, pdfHeight + 30);
                pdf.text(`ID de Autenticação OdontoSign: ${form.id}`, 15, pdfHeight + 34);

                const pdfBase64 = pdf.output('datauristring');

                // Final store update with signature and PDF
                updateFormStatus(id!, 'signed', signatureData, pdfBase64);
            }

            setSigned(true);
        } catch (error) {
            console.error('Erro ao processar assinatura:', error);
            alert('Ocorreu um erro ao gerar o documento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!form || !patient) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
                <h1 className="text-xl font-bold">Link Inválido ou Expirado</h1>
                <p className="text-neutral-500 mt-2">Este formulário não existe em nossa base de dados.</p>
            </div>
        );
    }

    const downloadPDF = () => {
        if (!form?.pdfUrl) return;
        const link = document.createElement('a');
        link.href = form.pdfUrl;
        link.download = `Termo_Assinado_${patient.name.replace(/\s+/g, '_')}.pdf`;
        link.click();
    };

    if (signed || form.status === 'signed') {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-700">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle2 className="text-green-600 w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Termo Assinado!</h1>
                <p className="text-neutral-500 mt-4 max-w-sm text-lg">
                    Obrigado, <strong>{patient.name.split(' ')[0]}</strong>. Sua assinatura foi processada e o documento PDF foi arquivado com segurança no consultório.
                </p>
                <div className="mt-8 flex flex-col items-center gap-4">
                    <Button
                        onClick={downloadPDF}
                        className="gap-2 px-8 py-6 text-lg bg-neutral-900 hover:bg-neutral-800"
                    >
                        <Download size={20} />
                        Baixar Minha Via (PDF)
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium bg-white px-4 py-2 rounded-full border shadow-sm">
                        <ShieldCheck size={14} className="text-primary" />
                        Certificado Digital OdontoSign v1.0
                    </div>
                    <p className="text-[9px] text-neutral-300 italic uppercase tracking-widest mt-2">Você pode fechar esta aba agora</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 flex flex-col items-center animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-8 scale-110">
                <HeartPulse className="text-primary w-8 h-8" />
                <span className="font-bold text-2xl tracking-tighter uppercase italic">OdontoSign</span>
            </div>

            <Card className="max-w-xl w-full shadow-2xl overflow-hidden border-0 rounded-2xl">
                <div className="bg-primary h-2" />
                <CardHeader className="bg-white border-b pb-6">
                    <CardTitle className="text-2xl font-bold">Termo de Consentimento</CardTitle>
                    <CardDescription className="text-base">
                        Paciente: <span className="font-bold text-neutral-900">{patient.name}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    <div id="document-content" className="p-10 bg-white text-neutral-700 leading-relaxed text-sm h-[400px] overflow-y-auto scrollbar-thin">
                        <h3 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2 text-center">CONSENTIMENTO PARA TRATAMENTO ODONTOLÓGICO</h3>
                        <div className="space-y-4 text-justify">
                            <p>
                                Eu, <strong>{patient.name}</strong>, inscrito(a) sob o CPF <strong>{patient.cpf}</strong>, declaro para os devidos fins que fui devidamente esclarecido(a) pelo(a) dentista responsável sobre o plano de tratamento odontológico sugerido em minha consulta.
                            </p>
                            <p>
                                Fui informado(a) de forma clara e objetiva sobre os procedimentos a serem realizados, sua natureza, finalidade, bem como os riscos e benefícios envolvidos. Tenho total consciência de que na odontologia, como em qualquer área da saúde, não é possível garantir resultados matemáticos ou infalíveis, dada a complexidade biológica de cada indivíduo.
                            </p>
                            <p>
                                Autorizo a execução dos procedimentos necessários para o meu caso clínico e comprometo-me a seguir rigorosamente todas as prescrições médicas e orientações fornecidas pelo consultório.
                            </p>
                            <p>
                                Confirmo que tive a oportunidade de esclarecer todas as minhas dúvidas e que este documento é assinado de livre e espontânea vontade, servindo como registro eletrônico de consentimento.
                            </p>
                        </div>

                        <div className="mt-16 text-[10px] text-neutral-400 border-t pt-4 flex justify-between">
                            <span>REF ID: {form.id.split('-')[0]}</span>
                            <span className="font-bold uppercase">OdontoSign Security</span>
                        </div>
                    </div>

                    <div className="bg-neutral-50 p-8 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-neutral-900">Assine no campo abaixo:</label>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-neutral-400 hover:text-red-500 h-8 gap-1 text-[10px]"
                                onClick={clear}
                            >
                                <RotateCcw size={12} />
                                LIMPAR
                            </Button>
                        </div>

                        <div className="bg-white border-2 border-dashed border-neutral-300 rounded-xl shadow-inner relative h-48 group transition-all focus-within:border-primary">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor='#1a1a1a'
                                canvasProps={{ className: 'signature-pad w-full h-full cursor-crosshair rounded-xl' }}
                            />
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-3 text-center italic">
                            A assinatura deve ser realizada com o dedo ou caneta stylus diretamente na tela.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="bg-white border-t p-8">
                    <Button
                        className="w-full py-7 text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        onClick={handleSign}
                        disabled={loading}
                    >
                        {loading ? 'GERANDO DOCUMENTO...' : 'CONFIRMAR E ASSINAR'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 flex flex-col items-center gap-3 text-center opacity-40 max-w-xs">
                <p className="text-[9px] text-neutral-500 uppercase tracking-tighter">
                    Este processo utiliza protocolos de segurança SSL e armazenamento criptografado em cache local.
                </p>
            </div>
        </div>
    );
}
