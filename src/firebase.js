// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnEIn4HeX4Ld2sueSjNyiBazDKqvkAwzs",
  authDomain: "movies-1a256.firebaseapp.com",
  projectId: "movies-1a256",
  storageBucket: "movies-1a256.appspot.com",
  messagingSenderId: "243482391994",
  appId: "1:243482391994:web:393a8da69144b8dd2e1983"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set up Google Auth Provider
const provider = new GoogleAuthProvider();
provider.addScope('profile'); // Ensure profile scope is included

// Function to handle sign-in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User:', user); // Check user object
  } catch (error) {
    console.error('Error during sign-in:', error.message);
  }
};

// Export instances and functions
export { auth, db, signInWithGoogle };
