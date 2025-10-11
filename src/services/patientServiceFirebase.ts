import { db } from "../firebase/config";
import {
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	query,
	where,
} from "firebase/firestore";

export class PatientServiceFirebase {
	static patientsRef = collection(db, "patients");

	static async getByCpf(cpf: string) {
		const q = query(this.patientsRef, where("cpf", "==", cpf));
		const snapshot = await getDocs(q);
		if (snapshot.empty) return null;
		const docSnap = snapshot.docs[0];
		return { id: docSnap.id, ...docSnap.data() };
	}

	static async create(data: any) {
		await addDoc(this.patientsRef, {
			...data,
			createdAt: new Date().toISOString(),
		});
	}

	static async update(cpf: string, data: any): Promise<void> {
		const q = query(this.patientsRef, where("cpf", "==", cpf));
		const snap = await getDocs(q);

		if (snap.empty) throw new Error("No patient found with that CPF.");

		const docRef = snap.docs[0].ref;
		const sanitized = Object.fromEntries(
			Object.entries(data).filter(([_, v]) => v !== undefined)
		);
		await updateDoc(docRef, sanitized as any);
	}
	static async delete(id: string) {
		const ref = doc(this.patientsRef, id);
		await deleteDoc(ref);
	}
}

export const patientServiceFirebase = new PatientServiceFirebase();
