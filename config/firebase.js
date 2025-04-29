import { initializeApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import dotenv from "dotenv"

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

const firebaseApp = initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const storage = getStorage(firebaseApp)

let firebaseAnalytics = null
isSupported().then((supported) => {
    if (supported) {
        firebaseAnalytics = getAnalytics(firebaseApp)
        console.log("Firebase Analytics is enabled.")
    } else (
        console.warn("Firebase Analytics is not supported in this environment.")
    )
}).catch((error) => {
    console.error("Error checking Firebase Analytics support:", error)
})

export { firebaseApp, firestore, auth, storage, firebaseAnalytics }
