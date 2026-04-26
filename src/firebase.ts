import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC5pNQ3qJFS1TWHqdfJbfomIYkq_5sE_Bc",
  authDomain: "lecturerfinder.firebaseapp.com",
  projectId: "lecturerfinder",
  storageBucket: "lecturerfinder.firebasestorage.app",
  messagingSenderId: "961608516651",
  appId: "1:961608516651:web:831d71cd400ac26354566e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);