import {GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAEoZWlIZRnLtnAarmVIYW0LIWhFnriUOY",
    authDomain: "just-camera-410616.firebaseapp.com",
    projectId: "just-camera-410616",
    storageBucket: "just-camera-410616.appspot.com",
    messagingSenderId: "749055290968",
    appId: "1:749055290968:web:a8140b2c9115bacbb5242d",
    measurementId: "G-PCY0CJ319F"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);

export { db , googleProvider};
