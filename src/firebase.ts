import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//GetAuth Method is used to Configure our app to use Firebase Authentication
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCx__foBRJLAxxwExVAdz8frIXKj8zd9_0",
  authDomain: "react-app-25347.firebaseapp.com",
  databaseURL:
    "https://react-app-25347-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-app-25347",
  storageBucket: "react-app-25347.appspot.com",
  messagingSenderId: "248439625196",
  appId: "1:248439625196:web:7340ea8b3581016e33dcc9",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
