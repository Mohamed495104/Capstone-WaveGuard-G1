import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);
