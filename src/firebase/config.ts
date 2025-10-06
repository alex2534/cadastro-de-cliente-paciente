import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCsFVfy8euuEe67Q2QvKI4iIG3FhtRh7LA",
	authDomain: "cadastrar-clientes-ba041.firebaseapp.com",
	projectId: "cadastrar-clientes-ba041",
	storageBucket: "cadastrar-clientes-ba041.firebasestorage.app",
	messagingSenderId: "454881610481",
	appId: "1:454881610481:web:aaf8dc7f180682076b3750",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
