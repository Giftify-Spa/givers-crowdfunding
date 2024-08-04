/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { FirebaseAuth } from "./config";
import { findError } from "./glosaryErrors";
import { AuthResponse } from "../interfaces/AuthResponse";


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ display: 'popup' });


interface AuthResult {
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
    user?: any;
    displayName?: string;
    email?: string;
    photoURL?: string;
    uid?: string;
}


export const signInWithGoogle = async (): Promise<AuthResponse> => {
    try {
        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        // const credentials = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        
        // const { displayName, email, photoURL, uid } = user;

        return {
            success: true,
            // User info
            // displayName, email, photoURL, uid
            user
        }
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        return {
            success: false,
            errorCode,
            errorMessage
        }
    }
}

export const registerUserWithEmailAndPassword = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
        const response = await createUserWithEmailAndPassword(FirebaseAuth, email, password);

        const { uid, photoURL } = response.user;

        await updateProfile(FirebaseAuth.currentUser, {
            displayName: name
        });

        return {
            success: true,
            uid, email, photoURL, displayName: name
        }
    } catch (error) {
        const translateError = findError(error.message);
        return {
            success: false,
            errorMessage: translateError.es
        }
    }
}


export const loginWithEmailAndPassword = async (email: string, password: string): Promise<AuthResult> => {
    try {
        const response = await signInWithEmailAndPassword(FirebaseAuth, email, password);
   
        const { displayName, email: userEmail, uid, photoURL } = response.user;
        return {
            success: true,
            displayName, email: userEmail, uid, photoURL
        }
    } catch (error) {
        console.log(error);
        const translateError = findError(error.message);
        return {
            success: false,
            errorMessage: translateError.es
        }
    }
}

export const logoutFirebase = async (): Promise<void> => {
    return await FirebaseAuth.signOut();
}