// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBj6sNzJfqoAgLFwCM_DWXzkiLksbKxwnY",
  authDomain: "e-commerceapp-59ac0.firebaseapp.com",
  projectId: "e-commerceapp-59ac0",
  storageBucket: "e-commerceapp-59ac0.firebasestorage.app",
  messagingSenderId: "815441724263",
  appId: "1:815441724263:web:0e02d9156e1647f2b5a5c2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
