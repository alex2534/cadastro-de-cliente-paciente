import { useState } from "react";
import styles from "./patienteForm.module.css";
import type { IPatient } from "../../types/patient/paciente";
import { useAppDispatch } from "../../hooks/patientHook";
import { addPatient } from "../../store/patientSlice";
import { v4 as uuidv4 } from "uuid";
import { maskCpf, isValidCPF } from "../../utils/cpf";

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
	const [form, setForm] = useState<Partial<IPatient>>(emptyPatient());
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [cpfError, setCpfError] = useState("");

	function setField<K extends keyof IPatient>(field: K, value: IPatient[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
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

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;

		const patient: IPatient = {
			id: uuidv4(),
			fullName: (form.fullName || "").trim(),
			socialName: form.socialName,
			motherName: form.motherName,
			birthDate: form.birthDate || "",
			gender: form.gender || "",
			cpf: (form.cpf || "").replace(/\D/g, ""),
			rg: form.rg,
			nationality: form.nationality,
			naturality: form.naturality,
			profession: form.profession,
			address: form.address,
			phone: form.phone,
			phoneSecondary: form.phoneSecondary,
			email: form.email,
			emergencyContactName: form.emergencyContactName,
			emergencyContactPhone: form.emergencyContactPhone,
			healthInsurance: form.healthInsurance,
			insuranceNumber: form.insuranceNumber,
			insuranceValidity: form.insuranceValidity,
			allergies: form.allergies,
			chronicDiseases: form.chronicDiseases,
			medications: form.medications,
			surgeries: form.surgeries,
			familyHistory: form.familyHistory,
			habits: form.habits,
			mainComplaint: form.mainComplaint,
			photoUrl: form.photoUrl,
			createdAt: new Date().toISOString(),
		};
		dispatch(addPatient(patient));
		alert("Paciente cadastrado com sucesso!");
		setForm(emptyPatient());
		setErrors({});
		setCpfError("");
	}

	const cpfDigits = (form.cpf || "").replace(/\D/g, "");
	const isFormInvalid =
		Object.keys(errors).length > 0 ||
		!form.fullName ||
		!form.birthDate ||
		!form.gender ||
		!form.cpf ||
		cpfDigits.length !== 11 ||
		!!cpfError;
	return (
		<form className={styles.form} onSubmit={onSubmit} noValidate>
			<h2>Cadastro de Paciente</h2>
			<section>
				<div className={styles.row}>
					<div className={styles.field}>
						<label className={styles.label}>
							Nome completo <span className={styles.required}>*</span>
						</label>
						<input
							className={styles.input}
							value={form.fullName || ""}
							onChange={(e) => setField("fullName", e.target.value)}
						/>
						{errors.fullName && (
							<div className={styles.error}>{errors.fullName}</div>
						)}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Nome social</label>
						<input
							className={styles.input}
							value={form.socialName || ""}
							onChange={(e) => setField("socialName", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Nome da mãe</label>
						<input
							className={styles.input}
							value={form.motherName || ""}
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
							className={styles.input}
							value={form.birthDate || ""}
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
							value={form.gender || ""}
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
							value={form.cpf || ""}
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
							className={styles.input}
							value={form.phone || ""}
							onChange={(e) => setField("phone", e.target.value)}
						/>
						{errors.phone && <div className={styles.error}>{errors.phone}</div>}
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Telefone fixo</label>
						<input
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
							className={styles.input}
							value={form.healthInsurance || ""}
							onChange={(e) => setField("healthInsurance", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Número da carteirinha</label>
						<input
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
							className={styles.textarea}
							value={form.chronicDiseases || ""}
							onChange={(e) => setField("chronicDiseases", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Medicamentos em uso</label>
						<textarea
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
							className={styles.textarea}
							value={form.surgeries || ""}
							onChange={(e) => setField("surgeries", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Histórico familiar</label>
						<textarea
							className={styles.textarea}
							value={form.familyHistory || ""}
							onChange={(e) => setField("familyHistory", e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label}>Hábitos de saúde</label>
						<textarea
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
							className={styles.textarea}
							value={form.mainComplaint || ""}
							onChange={(e) => setField("mainComplaint", e.target.value)}
						/>
					</div>
				</div>
			</section>
			<section>
				<div className={styles.actions}>
					<button
						type="button"
						className={`${styles.btn} ${styles.btnCancel}`}
						onClick={() => setForm(emptyPatient())}
					>
						Cancelar
					</button>
					<button type="submit" className={`${styles.btn} ${styles.btnSave}`}>
						Salvar
					</button>
				</div>
			</section>
		</form>
	);
}
