import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBCc_CjaQURioccGoJqgE3yjVkCIh_sxGU",
  authDomain: "whatsapp-2-ba501.firebaseapp.com",
  projectId: "whatsapp-2-ba501",
  storageBucket: "whatsapp-2-ba501.appspot.com",
  messagingSenderId: "992001630284",
  appId: "1:992001630284:web:29df26e3b85b3b8972d4e9",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
