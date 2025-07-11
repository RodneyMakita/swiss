import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, googleProvider, collection, doc, setDoc };
