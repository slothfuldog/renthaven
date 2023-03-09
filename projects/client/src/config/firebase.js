// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbyJEKO1BljfsN2BTnCLd_ilvXFLGeTeU",
  authDomain: "renthaven-e32be.firebaseapp.com",
  projectId: "renthaven-e32be",
  storageBucket: "renthaven-e32be.appspot.com",
  messagingSenderId: "726170649789",
  appId: "1:726170649789:web:09c55446ed19d981c763d4",
  measurementId: "G-TB13N964E7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const providerFacebook = new FacebookAuthProvider();
