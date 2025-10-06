import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PatientServiceFirebase } from "../services/patientServiceFirebase";
import type { IPatient } from "../types/patient/paciente";

interface PatientsState {
	patients: IPatient[];
	selectedPatient?: IPatient | null;
	loading: boolean;
	error?: string;
}

const initialState: PatientsState = {
	patients: [],
	selectedPatient: null,
	loading: false,
};

export const addPatientAsync = createAsyncThunk(
	"patients/create",
	async (patient: IPatient, { rejectWithValue }) => {
		try {
			await PatientServiceFirebase.create(patient);
			return patient;
		} catch (error: any) {
			return rejectWithValue(error.message || "Error creating patient");
		}
	}
);

export const fetchPatientByCpf = createAsyncThunk(
	"patients/fetchByCpf",
	async (cpf: string, { rejectWithValue }) => {
		try {
			const patient = await PatientServiceFirebase.getByCpf(cpf);
			if (!patient) {
				return rejectWithValue("No patient found for this CPF.");
			}
			return patient;
		} catch (error: any) {
			return rejectWithValue(error.message || "Error fetching patient");
		}
	}
);

export const updatePatientByCpf = createAsyncThunk(
	"patients/update",
	async (
		{ cpf, data }: { cpf: string; data: IPatient },
		{ rejectWithValue }
	) => {
		try {
			await PatientServiceFirebase.update(cpf, data);
			return { cpf, data };
		} catch (error: any) {
			return rejectWithValue(error.message || "Error updating patient");
		}
	}
);

export const deletePatientByCpf = createAsyncThunk(
	"patients/delete",
	async (id: string, { rejectWithValue }) => {
		try {
			await PatientServiceFirebase.delete(id);
			return id;
		} catch (error: any) {
			return rejectWithValue(error.message || "Error deleting patient");
		}
	}
);

const patientSlice = createSlice({
	name: "patients",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPatientByCpf.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchPatientByCpf.fulfilled, (state, action) => {
				state.loading = false;
				// Only assign if payload has expected patient properties
				if (
					action.payload &&
					typeof action.payload === "object" &&
					"cpf" in action.payload &&
					"fullName" in action.payload
				) {
					state.selectedPatient = action.payload as IPatient;
				} else {
					state.selectedPatient = null;
				}
			})
			.addCase(updatePatientByCpf.fulfilled, (state, action) => {
				state.selectedPatient = null;
			})
			.addCase(deletePatientByCpf.fulfilled, (state, action) => {
				state.patients = state.patients.filter((p) => p.cpf !== action.payload);
				state.selectedPatient = null;
			});
	},
});

// export default patientSlice.reducer;
export default patientSlice.reducer;
