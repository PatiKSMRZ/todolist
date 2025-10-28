import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAaDmgbSsOn1an5vl1Dn-AHw7W1mouJc38",   // Twój Web API Key
  projectId: "todo-list-13222",                          // Twój Project ID
  messagingSenderId: "834207789477",                     // Twój Project Number
  appId: "1:834207789477:android:xxxxxx"                // appId dla Android (musisz dodać Android App w Firebase)
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);