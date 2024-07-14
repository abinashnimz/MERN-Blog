// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-3cc41.firebaseapp.com",
  projectId: "mern-blog-3cc41",
  storageBucket: "mern-blog-3cc41.appspot.com",
  messagingSenderId: "967095799239",
  appId: "1:967095799239:web:8bc9c6727c04a1fa3bdde2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);