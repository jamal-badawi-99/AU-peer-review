import emailjs from "@emailjs/browser";
import firebase from "firebase/compat/app";
import { db } from "../firebase";

interface Props {
  email: string;
  fullName: string;
  userType: string;
  username: string;
}
export async function accountCreator(props: Props) {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
  const pass = generatePassword();

  await secondaryApp
    .auth()
    .createUserWithEmailAndPassword(props.email, pass)
    .then(async (a) => {
      await db
        .collection("users")
        .where("number", "==", props.username)
        .get()
        .then(async (querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            throw new Error("User already exists");
          } else {
            await db
              .collection("users")
              .doc(a.user?.uid)
              .set({
                fullName: props.fullName,
                email: props.email,
                userType: props.userType,
                number: props.username,
              })
              .then(async () => {
                await emailjs.send(
                  "service_f4o7j2r",
                  "template_ftr5nmc",
                  {
                    sendTo: props.email,
                    pass: pass,
                  },
                  "GUb3iWN1Xmonq1G-p"
                );
              });
          }
        })
        .catch((err) => {
          throw err.message;
        });
    })
    .catch((err) => {
      if (err === "User already exists") {
        throw err;
      }
      throw err.code;
    });

  await secondaryApp.auth().signOut();
  await secondaryApp.delete();
}
const generatePassword = () => {
  if (process.env.REACT_APP_DEV_PASSWORD) {
    return "12345678";
  }
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};
