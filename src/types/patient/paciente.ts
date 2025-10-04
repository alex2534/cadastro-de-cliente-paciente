export interface IPatient {
	id: string;
	fullName: string;
	socialName?: string;
	motherName?: string;
	birthDate: string; // ISO yyyy-mm-dd
	gender: string;
	cpf: string;
	rg?: string;
	nationality?: string;
	naturality?: string;
	profession?: string;
	address?: string;
	phone?: string;
	phoneSecondary?: string;
	email?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	healthInsurance?: string;
	insuranceNumber?: string;
	insuranceValidity?: string;
	allergies?: string;
	chronicDiseases?: string;
	medications?: string;
	surgeries?: string;
	familyHistory?: string;
	habits?: string;
	mainComplaint?: string;
	photoUrl?: string;
	createdAt: string;
}
