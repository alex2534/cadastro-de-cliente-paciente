import { api } from "../api/api";
import type { IPatient } from "../types/patient/paciente";

class PatientService {
	async create(patient: IPatient): Promise<IPatient> {
		const response = await api.post<IPatient>("/patients", patient);
		try {
			if (response.status === 201) {
				response.data;
			}
		} catch (error) {
			throw new Error("Failed to create patient! " + error);
		} finally {
			console.log("Request to create patient completed.");
		}

		return response.data;
	}
	async getAll(): Promise<IPatient[]> {
		const response = await api.get<IPatient[]>("/patients");
		try {
			if (response.status === 200) {
				response.data;
			}
		} catch (error) {
			throw new Error("Failed to fetch patients! " + error);
		} finally {
			console.log("Request to fetch patients completed.");
		}
		return response.data;
	}
	async getByCpf(cpf: string): Promise<IPatient> {
		const response = await api.get<IPatient>(`/patients/cpf/${cpf}`);
		try {
			if (response.status === 200) {
				response.data;
			}
		} catch (error) {
			throw new Error("Failed to fetch patient! " + error);
		} finally {
			console.log("Request to fetch patient completed.");
		}
		return response.data;
	}

	async update(
		cpf: string,
		patient: Partial<IPatient>
	): Promise<Partial<IPatient>> {
		const response = await api.put<Partial<IPatient>>(
			`/patients/update/${cpf}`,
			patient
		);
		try {
			if (response.status === 200) {
				response.data;
			}
		} catch (error) {
			throw new Error("Failed to update patient! " + error);
		} finally {
			console.log("Request to update patient completed.");
		}
		return response.data;
	}
	async delete(cpf: string): Promise<void> {
		const response = await api.delete<void>(`/patients/delete/${cpf}`);
		try {
			if (response.status === 204) {
				return;
			}
		} catch (error) {
			throw new Error("Failed to delete patient! " + error);
		} finally {
			console.log("Request to delete patient completed.");
		}
		return response.data;
	}
}
export const patientService = new PatientService();
