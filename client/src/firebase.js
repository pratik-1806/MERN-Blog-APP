// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogapp-c196d.firebaseapp.com",
  projectId: "blogapp-c196d",
  storageBucket: "blogapp-c196d.appspot.com",
  messagingSenderId: "222690156141",
  appId: "1:222690156141:web:3dffbc8f05dbc95b95a964"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);