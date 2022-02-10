import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/messaging";
import "firebase/storage";
import "firebase/functions";
import "firebase/auth";

if (!process.env.REACT_APP_ENV) {
  window.location.replace("error.html");
}

const appURL = window.location.origin;
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STROAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  serverKey: process.env.REACT_APP_SERVER_KEY,
  downloadPDF: process.env.REACT_APP_DOWNLOAD_PDF,
  linkedInRedirectURL: appURL + "/linkedIn",
  linkedInClientId: process.env.REACT_APP_LINKED_IN_CLIENT_ID,
  linkedInClientSecret: process.env.REACT_APP_LINKED_IN_CLIENT_SECRET,
  state: process.env.REACT_APP_STATE,
  linkedInLoginUrl: process.env.REACT_APP_LINKED_IN_LOGIN_URL,
  sendMailFunctionName: process.env.REACT_APP_SEND_MAIL_FUNCTION_NAME,
  deleteUserFunctionName: process.env.REACT_APP_DELETE_USER_FUNCTION_NAME,
  sendContactUsMailTo: process.env.REACT_APP_CONTACT_US_MAIL_ID,
  appURL: appURL,
};
const mailConfig = {
  template_id: process.env.REACT_APP_MAIL_TEMPLATE_ID,
  service_id: process.env.REACT_APP_MAIL_SERVER_ID,
  user_id: process.env.REACT_APP_MAIL_USER_ID,
  accessToken:process.env.REACT_APP_MAIL_ACCESS_TOKEN
};

const FIREBASE_API = {
  SIGN_UP: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
  SIGN_IN: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
  REFRESH: `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
  RESET_PASSWORD: `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseConfig.apiKey}`,
  SEND_NOTIFICATION: "https://fcm.googleapis.com/fcm/send",
};

firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.firestore();
const firebaseUsers = firebaseDB.collection("user");
const firebaseMessage = firebaseDB.collection("messages");
const firebaseIdeas = firebaseDB.collection("idea");
const firebaseChat = firebaseDB.collection("chat");
const firebaseNotifications = firebaseDB.collection("notification");
const firebaseFunctions = firebase.functions();
const firebaseStorageRef = firebase
  .app()
  .storage(firebaseConfig.storageBucket)
  .ref();
let firebaseMessaging = null;
try {
  firebaseMessaging = firebase.messaging();
  firebaseMessaging.usePublicVapidKey(process.env.REACT_APP_PUBLIC_VAPID_KEY);
} catch (error) {
  if (process.env.REACT_APP_ENV === "development") {
    console.error(error);
  }
}

export {
  firebaseConfig,
  FIREBASE_API,
  firebase,
  firebaseDB,
  firebaseUsers,
  firebaseStorageRef,
  firebaseIdeas,
  firebaseMessaging,
  firebaseNotifications,
  firebaseMessage,
  mailConfig,
  firebaseChat,
  firebaseFunctions,
};
