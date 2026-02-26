export interface Dentist {
    id: string;
    name: string;
    cro: string;
    clinicName?: string;
}

export type FormStatus = 'pending' | 'signed' | 'expired';

export interface Patient {
    id: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    createdAt: string;
}

export interface FormTemplate {
    id: string;
    title: string;
    content: string; // Markdown or HTML representation
}

export interface PatientForm {
    id: string;
    patientId: string;
    templateId: string;
    status: FormStatus;
    sentAt: string;
    signedAt?: string;
    pdfUrl?: string; // Data URI for the mock
    signatureData?: string; // Data URI
}
