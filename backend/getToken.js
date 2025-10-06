// getToken.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDg4mS6DUD1jQYL-0ORUcmVO7vaJg_I1k0",
    authDomain: "waveguard-407d8.firebaseapp.com",
    projectId: "waveguard-407d8",
    storageBucket: "waveguard-407d8.appspot.com",
    messagingSenderId: "78895315385",
    appId: "1:78895315385:web:da2b67816e63c745c35e68",
    measurementId: "G-5Q8Q7XJBQY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function loginAndGetToken() {
    const email = "test1@gmail.com";
    const password = "test@1234";

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCred.user.getIdToken();
        console.log("✅ Logged in successfully!");
        console.log("Firebase ID Token:\n", token);
    } catch (err) {
        console.error("❌ Login failed:", err.code, "-", err.message);
    }
}

loginAndGetToken();
