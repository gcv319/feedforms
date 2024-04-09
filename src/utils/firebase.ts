import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhA4-HfV8qfCD6ZZdEMdg05gp0Qzapk20",
  authDomain: "feedforms-3e13a.firebaseapp.com",
  projectId: "feedforms-3e13a",
  storageBucket: "feedforms-3e13a.appspot.com",
  messagingSenderId: "836897220345",
  appId: "1:836897220345:web:067b215520bf509801e428"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { auth, db, storage };