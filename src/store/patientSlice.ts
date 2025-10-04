import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IPatient } from "../types/patient/paciente";
interface PatientsState {
	patients: IPatient[];
}

const initialState: PatientsState = {
	patients: [],
};

const patientSlice = createSlice({
	name: "patients",
	initialState,
	reducers: {
		addPatient(state, action: PayloadAction<IPatient>) {
			state.patients.push(action.payload);
		},
		updatePatient(state, action: PayloadAction<IPatient>) {
			const idx = state.patients.findIndex((p) => p.id === action.payload.id);
			if (idx >= 0) state.patients[idx] = action.payload;
		},
		removePatient(state, action: PayloadAction<string>) {
			state.patients = state.patients.filter((p) => p.id !== action.payload);
		},
	},
});

export const { addPatient, updatePatient, removePatient } =
	patientSlice.actions;
export default patientSlice.reducer;
