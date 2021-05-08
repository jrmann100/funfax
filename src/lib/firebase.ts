import type { Writable } from "svelte/store";
import { initializeApp, getApps } from "firebase/app";
import { writable } from "svelte/store";
import type { User, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { FirebaseFirestore } from "firebase/firestore";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithCredential,
} from "firebase/auth";
import { browser } from "$app/env";

// Leave these undefined for SSR; if in a browser, we will await them in $layout/load()
export let auth: Auth = undefined;
export let db: FirebaseFirestore = undefined;
export let user: Writable<User> = writable(undefined);
export let initialized = (async () => {
    if (!browser || getApps().length !== 0) return;
    const app = initializeApp({
        apiKey: "AIzaSyBiJ0Ekx64Jfw2B0bliuKoASVWFXX5kB4A",
        authDomain: "funfax-net.firebaseapp.com",
        projectId: "funfax-net",
        storageBucket: "funfax-net.appspot.com",
        messagingSenderId: "194106239592",
        appId: "1:194106239592:web:65f06b451a2f63ab47a9dd",
    });
    auth = getAuth();
    db = getFirestore();
    auth.onAuthStateChanged(user.set);

    window["google"].accounts.id.initialize({
        client_id:
            "194106239592-jlrrhgjv90451tiitr0jn775iea8g11d.apps.googleusercontent.com",
        callback: async (c: any) =>
            await signInWithCredential(
                auth,
                GoogleAuthProvider.credential(c.credential)
            ),
    });
})();