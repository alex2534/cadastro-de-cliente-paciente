import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:8080/api", // ajuste para a sua API
	headers: {
		"Content-Type": "application/json",
	},
});
