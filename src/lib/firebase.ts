import type { Writable } from "svelte/store";
import { initializeApp, getApps } from "firebase/app";
import { writable } from "svelte/store";
import type { User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithCredential,
} from "firebase/auth";

if (getApps().length === 0)
    initializeApp({
        apiKey: "AIzaSyBiJ0Ekx64Jfw2B0bliuKoASVWFXX5kB4A",
        authDomain: "funfax-net.firebaseapp.com",
        projectId: "funfax-net",
        storageBucket: "funfax-net.appspot.com",
        messagingSenderId: "194106239592",
        appId: "1:194106239592:web:65f06b451a2f63ab47a9dd",
    });

export let auth = getAuth();
export let db = getFirestore();
export let user: Writable<User> = writable(undefined);

auth.onAuthStateChanged(user.set);

window["google"].accounts.id.initialize({
    client_id:
        "194106239592-jlrrhgjv90451tiitr0jn775iea8g11d.apps.googleusercontent.com",
    callback: async (c: any) =>
        await signInWithCredential(
            auth,
            GoogleAuthProvider.credential(c.credential)
        )
});