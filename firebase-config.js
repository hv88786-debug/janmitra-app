// ============================================================
// JanMitra AI — Firebase v10 Modular SDK setup
// ============================================================
// Loaded as <script type="module">. Exposes everything app.js
// needs on `window.JM` so the rest of the app can stay a plain
// classic script (keeps all existing onclick="" handlers working).
//
// >>> REPLACE these with your own Firebase project's config <<<
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc,
  onSnapshot, query, orderBy, serverTimestamp, getDocs,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPA5IsiHCYmmOqFbam2OsMFpkzLjUkMWs",
  authDomain: "day-6-4e23c.firebaseapp.com",
  projectId: "day-6-4e23c",
  storageBucket: "day-6-4e23c.firebasestorage.app",
  messagingSenderId: "607773740787",
  appId: "1:607773740787:web:12caf919192e2007313186",
  measurementId: "G-ZG51REW16D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

window.JM = {
  db, storage,
  collection, addDoc, doc, updateDoc, getDoc, setDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs,
  runTransaction,
  ref, uploadBytes, getDownloadURL
};

// Lets app.js know the SDK has finished loading before it runs anything Firebase-related.
window.dispatchEvent(new Event("jm-firebase-ready"));