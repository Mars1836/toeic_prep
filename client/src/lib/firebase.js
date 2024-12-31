// lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  onValue,
} from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeL7aNLwW5X8wi13VRmFtuuUSsslgcmbU",
  authDomain: "toeic-project-c00da.firebaseapp.com",
  databaseURL:
    "https://toeic-project-c00da-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "toeic-project-c00da",
  storageBucket: "toeic-project-c00da.firebasestorage.app",
  messagingSenderId: "234581371916",
  appId: "1:234581371916:web:19d9e6d3d0478320f25229",
  measurementId: "G-QJDHH9461S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child, push, onValue };
