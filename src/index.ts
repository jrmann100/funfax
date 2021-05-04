import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential, User } from "firebase/auth";

// Script loaded in <body>, attaches to window.
declare var google: any;

// Start Firebase.
const app = initializeApp({
    apiKey: "AIzaSyBiJ0Ekx64Jfw2B0bliuKoASVWFXX5kB4A",
    authDomain: "funfax-net.firebaseapp.com",
    projectId: "funfax-net",
    storageBucket: "funfax-net.appspot.com",
    messagingSenderId: "194106239592",
    appId: "1:194106239592:web:65f06b451a2f63ab47a9dd"
});

const auth = getAuth();

// Links Firebase and Sign In With Google.
const handleCredentialResponse = async (c: any) => await signInWithCredential(auth, GoogleAuthProvider.credential(c.credential))

const elements = {
    name: document.querySelector('#name') as HTMLSpanElement,
    logout: document.querySelector('#logout') as HTMLAnchorElement,
    google: document.querySelector('#google') as HTMLDivElement
}

elements.logout.addEventListener('click', () => auth.signOut());

const authState = {
    stateChangeHandler(user: User) {
        if (user === null && authState._user !== null)
            authState.logout();
        else if (user)
            authState.login(user);
        else
            authState.init();
    },
    init() {
        authState._initialized = true;
        // Start Sign In With Google.
        google.accounts.id.initialize({
            client_id: '194106239592-jlrrhgjv90451tiitr0jn775iea8g11d.apps.googleusercontent.com',
            callback: handleCredentialResponse,
            // auto_select: true // Automatically remembers you and logs you in. Kind of annoying.
        });
        // Render One Tap.
        google.accounts.id.prompt();
        // Render Sign In With Google button.
        google.accounts.id.renderButton(document.querySelector('div#google'), {
            'theme': 'filled_blue',
        });
    },
    get user() {
        return authState._user;
    },
    login(user: User) {
        console.log('login');
        authState._user = user;
        elements.name.textContent = user.displayName;
        elements.logout.textContent = 'log out.';
        elements.google.style.display = 'none';
    },
    logout() {
        console.log('logout');
        elements.name.textContent = 'logged out';
        elements.logout.textContent = '';
        elements.google.style.display = 'block';
        // Render One Tap.
        google.accounts.id.prompt();
        authState._user = null;
        if (!authState._initialized)
            authState.init();
    },
    _user: null as User,
    _initialized: false

};

auth.onAuthStateChanged(authState.stateChangeHandler);

Object.assign(window, { auth: auth }); // debug