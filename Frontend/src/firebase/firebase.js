// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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

// Initialize Firestore
export const db = getFirestore(app);

/**
 * Create a default admin document in the top-level `admin` collection.
 * - Document ID: `main_admin`
 * - Fields: email, password, role, createdAt (serverTimestamp)
 * If the document already exists, does nothing.
 */
export async function createDefaultAdmin() {
  try {
    const adminRef = doc(db, "admin", "main_admin");
    const snap = await getDoc(adminRef);
    if (snap.exists()) {
      console.log("Admin already exists");
      // Ensure an Auth user exists for the admin email as well
      try {
        const data = snap.data();
        const adminEmail = data?.email;
        const adminPassword = data?.password;
        if (adminEmail && adminPassword) {
          try {
            await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
            console.log("Auth user for admin created");
          } catch (authErr) {
            if (authErr.code === "auth/email-already-in-use") {
              // User already exists in Auth — nothing to do
              console.log("Admin auth user already exists");
            } else {
              console.warn("Could not create admin auth user:", authErr);
            }
          }
        }
      } catch (e) {
        console.warn("Error ensuring admin auth user:", e);
      }
      return;
    }

    const adminData = {
      email: "admin@gmail.com",
      password: "admin@123",
      role: "admin",
      createdAt: serverTimestamp(),
    };

    await setDoc(adminRef, adminData);

    console.log("Admin created successfully");

    // Also attempt to create a Firebase Auth user for the admin so email/password login works
    try {
      await createUserWithEmailAndPassword(auth, adminData.email, adminData.password);
      console.log("Auth user for admin created successfully");
    } catch (authErr) {
      if (authErr.code === "auth/email-already-in-use") {
        console.log("Admin auth user already exists");
      } else {
        console.warn("Failed to create admin auth user:", authErr);
      }
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}