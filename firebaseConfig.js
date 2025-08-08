// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth} from 'firebase/auth'
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_Y7DshKQZrZqpTz5W1s9I2XhsKAnYBko",
  authDomain: "fir-chat-98864.firebaseapp.com",
  projectId: "fir-chat-98864",
  storageBucket: "fir-chat-98864.firebasestorage.app",
  messagingSenderId: "478352669106",
  appId: "1:478352669106:web:8a554180476e7474194cab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');