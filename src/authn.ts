import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";



const handleCredentialResponse = async (c: any) => await signInWithCredential(auth, GoogleAuthProvider.credential(c.credential))
// window.handleCredentialResponse = handleCredentialResponse;

declare var google: any;

google.accounts.id.initialize({
    client_id: '194106239592-jlrrhgjv90451tiitr0jn775iea8g11d.apps.googleusercontent.com',
    callback: handleCredentialResponse,
    // auto_select: true
});
google.accounts.id.prompt();
google.accounts.id.renderButton(document.querySelector('div#google'), {
    'scope': 'profile email',
    'width': 240,
    'height': 100,
    'longtitle': true,
    'theme': 'filled_blue',
});

const auth = getAuth();

// const login = document.querySelector('button#login');
// login.addEventListener('click', async (e) => {
//     try {
//         const provider = new GoogleAuthProvider();
//         const result = await signInWithCredential(auth, provider);
//     } catch (error) {
//         throw (error);
//     }
// });

auth.onAuthStateChanged((user) => console.log('user!', user));

Object.assign(window, { auth: auth });