import { useState } from "react";
import styles from "./patienteForm.module.css";
import type { IPatient } from "../../types/patient/paciente";
import { useAppDispatch, useAppSelector } from "../../hooks/patientHook";
import { v4 as uuidv4 } from "uuid";
import { maskCpf, isValidCPF } from "../../utils/cpf";
import { PatientServiceFirebase } from "../../services/patientServiceFirebase";

import {
	addPatientAsync,
	fetchPatientByCpf,
	updatePatientByCpf,
	deletePatientByCpf,
} from "../../store/patientSlice";

const requiredFields = [
	"fullName",
	"birthDate",
	"gender",
	"cpf",
	"address",
	"phone",
	"emergencyContactName",
	"emergencyContactPhone",
	"allergies",
];
const emptyPatient = (): Partial<IPatient> => ({
	fullName: "",
	socialName: "",
	motherName: "",
	birthDate: "",
	gender: "",
	cpf: "",
	rg: "",
	nationality: "",
	naturality: "",
	profession: "",
	address: "",
	phone: "",
	phoneSecondary: "",
	email: "",
	emergencyContactName: "",
	emergencyContactPhone: "",
	healthInsurance: "",
	insuranceNumber: "",
	insuranceValidity: "",
	allergies: "",
	chronicDiseases: "",
	medications: "",
	surgeries: "",
	familyHistory: "",
	habits: "",
	mainComplaint: "",
});

export default function PatienteForm() {
	const dispatch = useAppDispatch();
	const { selectedPatient, loading } = useAppSelector(
		(state) => state.patients
	);

	console.log("Selected Patient from Redux:", selectedPatient);
	const [form, setForm] = useState<Partial<IPatient>>(emptyPatient());
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [cpfError, setCpfError] = useState("");
	const [searchCpf, setSearchCpf] = useState("");
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);

	function setField<K extends keyof IPatient>(field: K, value: IPatient[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	const handleSearch = async () => {
		try {
			const patient = await PatientServiceFirebase.getByCpf(searchCpf);

			if (!patient) {
				setSearchCpf("Cpf not found");
				return;
			}

			setForm(patient);
			console.log("Patient fetched:", patient);
		} catch (error) {
		} finally {
			setIsError(false);
			console.log("Request to fetch patient completed.");
		}

		if (!isValidCPF(searchCpf)) {
			setMessage("CPF inválido para pesquisa.");
			return;
		}
		dispatch(fetchPatientByCpf(searchCpf.replace(/\D/g, "")));
	};

	async function handleUpdate() {
		if (!form.cpf) return;
		console.log("Form to update:", form);
		await dispatch(
			updatePatientByCpf({ cpf: form.cpf, data: form as IPatient })
		);
		setMessage("Paciente atualizado com sucesso!");
	}

	async function handleDelete() {
		if (!form.cpf) return;
		if (!window.confirm("Confirma a exclusão deste paciente?")) return;
		await dispatch(deletePatientByCpf(form.cpf));
		setForm(emptyPatient());
		setMessage("Paciente excluído com sucesso!");
	}

	function validate() {
		const newErrors: Record<string, string> = {};

		// required fields
		requiredFields.forEach((f) => {
			// @ts-ignore
			if (!form[f]) newErrors[f] = "Campo obrigatório";
		});

		// CPF completo e válido
		if (form.cpf) {
			const digits = form.cpf.replace(/\D/g, "");
			if (digits.length !== 11 || !isValidCPF(digits)) {
				newErrors.cpf = "CPF inválido";
			}
		}

		// email simples
		if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
			newErrors.email = "E-mail inválido";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
		const raw = e.target.value;
		const masked = maskCpf(raw);
		setField("cpf", masked);

		const digits = masked.replace(/\D/g, "");
		if (digits.length === 11) {
			if (!isValidCPF(digits)) {
				setCpfError("CPF inválido");
			} else {
				setCpfError("");
			}
		} else {
			// incompleto -> sem erro explícito (mas botão ficará desabilitado)
			setCpfError("");
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;

		const patient: IPatient = {
			id: uuidv4(),
			...form,
			cpf: (form.cpf || "").replace(/\D/g, ""),
			createdAt: new Date().toISOString(),
		} as IPatient;

		await dispatch(addPatientAsync(patient));

		setForm(emptyPatient());
		setErrors({});
		setCpfError("");
		setMessage("Paciente cadastrado com sucesso!");
	}

	const cpfDigits = (form.cpf || "").replace(/\D/g, "");

	const isFormInvalid =
		Object.keys(errors).length > 0 ||
		!form.fullName ||
		!form.motherName ||
		!form.birthDate ||
		!form.gender ||
		!form.cpf ||
		cpfDigits.length !== 11 ||
		!!cpfError;
	!form.address ||
		!form.phone ||
		!form.emergencyContactName ||
		!form.emergencyContactPhone ||
		!form.allergies;

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<h2>Cadastro e Gerenciamento de Pacientes</h2>
			{/* 🔍 Busca por CPF */}
			{message && (
				<div
					className={
						isError
							? styles.errorMessage // red background for errors
							: styles.successMessage // green background for success
					}
				>
					{message}
				</div>
			)}
			<div className={styles.row}>
				<div className={styles.field}>
					<label className={styles.label}>Buscar por CPF</label>
					<input
						className={styles.input}
						value={maskCpf(searchCpf)}
						onChange={(e) => setSearchCpf(maskCpf(e.target.value))}
						placeholder="000.000.000-00"
					/>
				</div>
				<button
					type="button"
					className={`${styles.btn} ${styles.btnSearch}`}
					onClick={handleSearch}
					disabled={loading}
				>
					Buscar
				</button>
			</div>

			{/* {isError === true && (
				<p style={{ color: isError ? "red" : "green" }}>{message}</p>
			)} */}
			<section>
				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>
							Nome completo <span className={styles.required}>*</span>
						</label>
						<input
							type="text"
							placeholder="Nome completo"
							className={styles.input}
							value={form.fullName}
							onChange={(e) => setField("fullName", e.target.value)}
						/>
						{errors.fullName && (
							<div className={styles.error}>{errors.fullName}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Nome social</label>
						<input
							type="text"
							placeholder="Nome social"
							className={styles.input}
							value={form.socialName}
							onChange={(e) => setField("socialName", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Nome da mãe</label>
						<input
							type="text"
							placeholder="Nome da mãe"
							className={styles.input}
							value={form.motherName}
							onChange={(e) => setField("motherName", e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>
							Data de nascimento <span className={styles.required}>*</span>
						</label>
						<input
							type="date"
							placeholder="Data de nascimento"
							className={styles.input}
							value={form.birthDate}
							onChange={(e) => setField("birthDate", e.target.value)}
						/>
						{errors.birthDate && (
							<div className={styles.error}>{errors.birthDate}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>
							Gênero/Sexo <span className={styles.required}>*</span>
						</label>
						<select
							className={styles.select}
							value={form.gender}
							onChange={(e) => setField("gender", e.target.value)}
						>
							<option value="">-- selecione --</option>
							<option value="F">Feminino</option>
							<option value="M">Masculino</option>
							<option value="O">Outro</option>
							<option value="NS">Prefiro não informar</option>
						</select>
						{errors.gender && (
							<div className={styles.error}>{errors.gender}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>
							CPF <span className={styles.required}>*</span>
						</label>
						<input
							className={styles.input}
							type="text"
							id="cpf"
							value={form.cpf}
							onChange={handleCpfChange}
							placeholder="000.000.000-00"
							maxLength={14}
						/>
						{(errors.cpf || cpfError) && (
							<div className={styles.error}>{errors.cpf || cpfError}</div>
						)}
					</div>
				</div>
			</section>
			<section>
				<h3>Contato</h3>
				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>
							Endereço completo <span className={styles.required}>*</span>
						</label>
						<input
							className={styles.input}
							type="text"
							id="address"
							value={form.address || ""}
							onChange={(e) => setField("address", e.target.value)}
						/>
						{errors.address && (
							<div className={styles.error}>{errors.address}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>
							Telefone celular <span className={styles.required}>*</span>
						</label>
						<input
							type="text"
							id="phone"
							className={styles.input}
							value={form.phone || ""}
							onChange={(e) => setField("phone", e.target.value)}
						/>
						{errors.phone && <div className={styles.error}>{errors.phone}</div>}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Telefone fixo</label>
						<input
							type="text"
							className={styles.input}
							value={form.phoneSecondary || ""}
							onChange={(e) => setField("phoneSecondary", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>E-mail</label>
						<input
							type="email"
							className={styles.input}
							value={form.email || ""}
							onChange={(e) => setField("email", e.target.value)}
						/>
						{errors.email && <div className={styles.error}>{errors.email}</div>}
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>
							Contato de emergência (nome){" "}
							<span className={styles.required}>*</span>
						</label>
						<input
							type="text"
							className={styles.input}
							value={form.emergencyContactName || ""}
							onChange={(e) => setField("emergencyContactName", e.target.value)}
						/>
						{errors.emergencyContactName && (
							<div className={styles.error}>{errors.emergencyContactName}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>
							Contato de emergência (telefone){" "}
							<span className={styles.required}>*</span>
						</label>
						<input
							type="text"
							className={styles.input}
							value={form.emergencyContactPhone || ""}
							onChange={(e) =>
								setField("emergencyContactPhone", e.target.value)
							}
						/>
						{errors.emergencyContactPhone && (
							<div className={styles.error}>{errors.emergencyContactPhone}</div>
						)}
					</div>
				</div>
			</section>

			<section>
				<h3>Convênio / Financeiro</h3>
				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>Convênio / Plano de saúde</label>
						<input
							type="text"
							className={styles.input}
							value={form.healthInsurance || ""}
							onChange={(e) => setField("healthInsurance", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Número da carteirinha</label>
						<input
							type="text"
							className={styles.input}
							value={form.insuranceNumber || ""}
							onChange={(e) => setField("insuranceNumber", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Validade</label>
						<input
							type="date"
							className={styles.input}
							value={form.insuranceValidity || ""}
							onChange={(e) => setField("insuranceValidity", e.target.value)}
						/>
					</div>
				</div>
			</section>
			<section>
				<h3>Histórico Clínico</h3>
				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>
							Alergias <span className={styles.required}>*</span>
						</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.allergies || ""}
							onChange={(e) => setField("allergies", e.target.value)}
						/>
						{errors.allergies && (
							<div className={styles.error}>{errors.allergies}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Doenças crônicas</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.chronicDiseases || ""}
							onChange={(e) => setField("chronicDiseases", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Medicamentos em uso</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.medications || ""}
							onChange={(e) => setField("medications", e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>Cirurgias anteriores</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.surgeries || ""}
							onChange={(e) => setField("surgeries", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Histórico familiar</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.familyHistory || ""}
							onChange={(e) => setField("familyHistory", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Hábitos de saúde</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.habits || ""}
							onChange={(e) => setField("habits", e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.field} style={{ flex: "1 1 100%" }}>
						<label className={styles.label}>Queixa principal</label>
						<textarea
							typeof="text"
							className={styles.textarea}
							value={form.mainComplaint || ""}
							onChange={(e) => setField("mainComplaint", e.target.value)}
						/>
					</div>
				</div>
			</section>
			<section>
				<div className={styles.buttonGroup}>
					<button
						type="button"
						className={`${styles.btn} ${styles.btnClear}`}
						onClick={() => setForm(emptyPatient())}
					>
						Cancelar
					</button>
					<button
						type="submit"
						className={`${styles.btn} ${styles.btnSave}`}
						disabled={isFormInvalid}
					>
						Salvar
					</button>
					<button
						type="button"
						className={`${styles.btn} ${styles.btnUpdate}`}
						onClick={handleUpdate}
					>
						Atualizar
					</button>
					<button
						type="button"
						className={`${styles.btn} ${styles.btnDelete}`}
						onClick={handleDelete}
					>
						Excluir
					</button>
					{/* <button onClick={() => patientServiceFirebase.seedPatient()}>
						Add Example Patient
					</button> */}
				</div>
				{isFormInvalid && (
					<div className={styles.error}>
						Preencha todos os campos obrigatórios corretamente.
					</div>
				)}
			</section>
		</form>
	);
}
