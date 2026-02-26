import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Dentist, Patient, PatientForm } from '../types';

interface OdontoState {
    currentDentist: Dentist | null;
    patients: Patient[];
    forms: PatientForm[];

    // Actions
    setDentist: (dentist: Dentist | null) => void;
    addPatient: (patient: Patient) => void;
    removePatient: (id: string) => void;
    addForm: (form: PatientForm) => void;
    updateFormStatus: (id: string, status: PatientForm['status'], signatureData?: string, pdfUrl?: string) => void;
    logout: () => void;
}

export const useStore = create<OdontoState>()(
    persist(
        (set) => ({
            currentDentist: null,
            patients: [],
            forms: [],

            setDentist: (dentist) => set({ currentDentist: dentist }),

            addPatient: (patient) => set((state) => ({
                patients: [...state.patients, patient]
            })),

            removePatient: (id) => set((state) => ({
                patients: state.patients.filter(p => p.id !== id),
                forms: state.forms.filter(f => f.patientId !== id)
            })),

            addForm: (form) => set((state) => ({
                forms: [...state.forms, form]
            })),

            updateFormStatus: (id, status, signatureData, pdfUrl) => set((state) => ({
                forms: state.forms.map(f => f.id === id ? {
                    ...f,
                    status,
                    signatureData: signatureData || f.signatureData,
                    pdfUrl: pdfUrl || f.pdfUrl,
                    signedAt: status === 'signed' ? new Date().toISOString() : f.signedAt
                } : f)
            })),

            logout: () => set({ currentDentist: null }),
        }),
        {
            name: 'odontosign-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
