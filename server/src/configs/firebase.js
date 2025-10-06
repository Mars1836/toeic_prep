"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ref = exports.onValue = exports.get = exports.set = exports.firebase = void 0;
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, get, onValue } = require("firebase/database");
exports.ref = ref;
exports.set = set;
exports.get = get;
exports.onValue = onValue;
// Firebase config từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDeL7aNLwW5X8wi13VRmFtuuUSsslgcmbU",
    authDomain: "toeic-project-c00da.firebaseapp.com",
    databaseURL: "https://toeic-project-c00da-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "toeic-project-c00da",
    storageBucket: "toeic-project-c00da.firebasestorage.app",
    messagingSenderId: "234581371916",
    appId: "1:234581371916:web:19d9e6d3d0478320f25229",
    measurementId: "G-QJDHH9461S",
};
// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);
const firebase = getDatabase(app);
exports.firebase = firebase;
// Lắng nghe thay đổi dữ liệu
onValue(ref(firebase, "users"), (snapshot) => {
    console.log("Updated data:", snapshot.val());
});
