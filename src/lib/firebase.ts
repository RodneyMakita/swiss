import { GoogleAuthProvider, FacebookAuthProvider, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc , getDoc , query, where ,  getDocs} from 'firebase/firestore';
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
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const storage = getStorage(app); 

export { auth, googleProvider, facebookProvider, db, storage ,  collection, doc, setDoc , getDoc , query, where , getDocs  }; 
