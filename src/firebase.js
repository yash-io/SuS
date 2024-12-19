// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyO6KGVmqVbeorkkBDNG9GLzZlE53p7u8",
  authDomain: "url-sus.firebaseapp.com",
  databaseURL: "https://url-sus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "url-sus",
  storageBucket: "url-sus.firebasestorage.app",
  messagingSenderId: "737787691054",
  appId: "1:737787691054:web:f213a7b7ae110948839fbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);   
export { db };