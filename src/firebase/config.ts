import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
	messagingSenderId: import.meta.env
		.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
	appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};
console.log("apiKey ", firebaseConfig.apiKey);
console.log("authDomain ", firebaseConfig.authDomain);
console.log("projectId ", firebaseConfig.projectId);
console.log("storageBucket ", firebaseConfig.storageBucket);
console.log("messagingSenderId ", firebaseConfig.messagingSenderId);
console.log("appId ", firebaseConfig.appId);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
