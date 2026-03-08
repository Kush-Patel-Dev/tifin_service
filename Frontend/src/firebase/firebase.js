// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuKqzk5zkwODASeEIVMtG2zrCDga7xczg",
  authDomain: "tiffin-service-a021d.firebaseapp.com",
  projectId: "tiffin-service-a021d",
  storageBucket: "tiffin-service-a021d.firebasestorage.app",
  messagingSenderId: "87192513479",
  appId: "1:87192513479:web:edcf23a33c0ae583d6c7e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();