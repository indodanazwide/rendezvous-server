import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { firebaseApp } from "../config/firebase.js"

const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

/**
 * Register a new user with email and password.
 * @param {Object} userData - User data for registration.
 * @param {string} userData.name - User's first name.
 * @param {string} userData.surname - User's last name.
 * @param {string} userData.email - User's email.
 * @param {string} userData.password - User's password.
 * @param {string} userData.role - User's role (e.g., student, staff, admin, external_user).
 * @param {string|null} userData.studentNumber - Optional student number.
 * @param {string|null} userData.phone - Optional phone number.
 * @returns {Promise<Object>} - The created user document.
 */

/**
 * Login a user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - The logged-in user's data.
 */

/**
 * Send a password reset email to the user.
 * @param {string} email - User's email.
 * @returns {Promise<void>} - Resolves if the email was sent successfully.
 */

/**
 * Sign in or register a user using Google OAuth.
 * @returns {Promise<Object>} - The authenticated user's data.
 */

export const registerUser = async ({
    name,
    surname,
    email,
    password,
    role,
    studentNumber = null,
    phone = null,
}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await updateProfile(user, {
            displayName: `${name} ${surname}`
        })

        const userData = {
            name,
            surname,
            email: user.email,
            role,
            isActive: true,
            provider: user.providerData[0]?.providerId || "password",
            avatarUrl: user.photoURL || null,
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp(),
            studentNumber,
            phone,
            isVerified: false,
        }

        const userDocRef = doc(firestore, "users", user.uid)
        await setDoc(userDocRef, userData)

        console.log("User registered successfully:", userData)
        return userData
    } catch (error) {
        console.error("Error registering user:", error)
        throw error
    }
}

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Update last login timestamp in Firestore
        const userDocRef = doc(firestore, "users", user.uid)
        await updateDoc(userDocRef, {
            lastLogin: serverTimestamp()
        })

        console.log("User logged in successfully:", user.email)
        return { uid: user.uid, email: user.email }
    } catch (error) {
        console.error("Error logging in user:", error)
        throw error
    }
}

export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email)
        console.log("Password reset email sent to:", email)
    } catch (error) {
        console.error("Error sending password reset email:", error)
        throw error
    }
}