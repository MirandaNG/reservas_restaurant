// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRc7VZR7ZlNyKY7cd0nCgPED1-YwcWA2E",
  authDomain: "reservas-restaurant-af05e.firebaseapp.com",
  projectId: "reservas-restaurant-af05e",
  storageBucket: "reservas-restaurant-af05e.firebasestorage.app",
  messagingSenderId: "347315450040",
  appId: "1:347315450040:web:03226f7332ebc6d39f844d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;