export function maskCpf(value: string): string {
	return value
		.replace(/\D/g, "")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function isValidCPF(cpf: string): boolean {
	cpf = cpf.replace(/\D/g, "");
	if (cpf.length !== 11 || /^(?:([0-9])\1{10})$/.test(cpf)) return false;

	let sum = 0;
	for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
	let rev = 11 - (sum % 11);
	if (rev === 10 || rev === 11) rev = 0;
	if (rev !== parseInt(cpf.charAt(9))) return false;

	sum = 0;
	for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (sum % 11);
	if (rev === 10 || rev === 11) rev = 0;
	if (rev !== parseInt(cpf.charAt(10))) return false;

	return true;
}

export function maskPhone(value: string): string {
	return value
		.replace(/\D/g, "")
		.replace(/(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d{4})$/, "$1-$2")
		.replace(/(\d{4})(\d{4})$/, "$1-$2");
}

export function isValidPhone(phone: string): boolean {
	const digits = phone.replace(/\D/g, "");
	return digits.length === 10 || digits.length === 11;
}
