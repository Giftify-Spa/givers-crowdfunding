/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useReducer } from "react";
import { AuthState, authReducer } from "./authReducer";

import { signInWithGoogle, loginWithEmailAndPassword, logoutFirebase } from "../../firebase/providers";
import { User } from '../../interfaces/User';
import { addDocument, checkIfDocumentExists } from "../../firebase/service";
import { getUserByEmail, getUserByUid } from "../../firebase/services/UserServices";
import { AuthResponse } from "../../interfaces/AuthResponse";
import { registerUserWithEmailAndPassword } from "../../firebase/providers";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "../../firebase/config";
import { updateDoc } from "firebase/firestore";

type AuthContextProps = {
    user: User | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    startGoogleSignIn: () => void,
    startLoginWithEmailAndPasssword: (email: string, password: string) => Promise<AuthResponse>,
    startLogout: () => void,
    startCreatingUserWithEmailAndPassword: (email: string, password: string, name: string) => Promise<AuthResponse>
}

const authInitialState: AuthState = {
    status: 'checking',
    user: null,
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FirebaseAuth, async (authUser) => {
            if (authUser) {

                const user = await getUserByUid(authUser.uid);

                dispatch({
                    type: "auth",
                    payload: {
                        user: {
                            id: user.id,
                            uid: user.uid,
                            name: user.name,
                            email: user.email,
                            status: user.status,
                            profile: user.profile,
                            photoURL: user.photoURL,
                            ...(user.foundation ? { foundation: user.foundation } : {})
                        }
                    }
                });
            }
        });

        return () => unsubscribe();
    }, []);



    const startGoogleSignIn = async () => {
        const result = await signInWithGoogle();

        if (!result.success) {

            dispatch({
                type: "not-authenticated"
            });

            // console.log('Error', result.errorMessage);
        }

        const { uid, displayName, email, photoURL } = result.user;

        // Format user data
        const userData = {
            uid,
            name: displayName,
            email,
            status: true,
            profile: 'Client',
            photoURL
        }

        // Search user in the DB with the uid
        const existUser = await checkIfDocumentExists('users', 'uid', uid);

        if (!existUser) {
            // Save user in the DB
            await addDocument('users', userData);
            return dispatch({
                type: "auth",
                payload: {
                    user: userData
                }
            });
        }

        const user = await getUserByUid(userData.uid);

        return dispatch({
            type: "auth",
            payload: {
                user: {
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    profile: user.profile,
                    photoURL: user.photoURL,
                    ...(user.foundation ? { foundation: user.foundation } : {})
                }
            }
        });

    }

    const startCreatingUserWithEmailAndPassword = async (name: string, email: string, password: string): Promise<AuthResponse> => {
        const { success, uid, email: userEmail, photoURL, displayName, errorMessage } = await registerUserWithEmailAndPassword(name, email, password);

        if (!success) {
            dispatch({
                type: "not-authenticated"
            });

            return {
                success,
                errorMessage
            };
        }

        const userCheck = await getUserByUid(uid);

        // Format user data
        const userData = {
            id: userCheck.id,
            uid,
            name: displayName,
            email: userEmail,
            status: true,
            profile: 'Client',
            photoURL,
        }

        // Search user in the DB with the uid
        const existUser = await checkIfDocumentExists('users', 'uid', uid);

        console.log('EXISTS: ', existUser);

        if (!existUser) {
            // check temporal user
            const existUserEmail = await checkIfDocumentExists('users', 'email', userData.email);

            if (!existUserEmail) {
                // Save user in the DB
                await addDocument('users', userData);
                dispatch({
                    type: "auth",
                    payload: {
                        user: {
                            ...userData,
                        }
                    }
                });

                return {
                    success: true
                }
            } else {
                const userRef = await getUserByEmail(userData.email);
                if (userRef) {
                    await updateDoc(userRef.ref,
                        {
                            "uid": userData.uid,
                            "profile": userData.profile,
                            "status": userData.status
                        });
                }
            }

        }

        const user = await getUserByUid(userData.uid);

        dispatch({
            type: "auth",
            payload: {
                user: {
                    id: user.id,
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    profile: user.profile,
                    photoURL: user.photoURL,
                    ...(user.foundation ? { foundation: user.foundation } : {})
                }
            }
        });

        return {
            success: true,
        }
    }

    const startLoginWithEmailAndPasssword = async (emailUser: string, password: string): Promise<AuthResponse> => {

        const { success, displayName, email, uid, photoURL, errorMessage } = await loginWithEmailAndPassword(emailUser, password);

        if (!success) return { success, errorMessage };
        
        if (!success) {
            dispatch({
                type: "not-authenticated",
            });

            return {
                success,
                errorMessage
            };
        }

        const user = await getUserByUid(uid);

        // Check if the user status is false
        if (!user.status) {
            dispatch({
                type: "not-authenticated",
            });

            return {
                success: false,
                errorMessage: "Tu cuenta se encuentra deshabilitada. Por favor, contacta al administrador.",
            };
        }

        dispatch({
            type: "auth",
            payload: {
                user: {
                    id: user.id,
                    uid,
                    name: displayName,
                    email,
                    status: true,
                    profile: user.profile,
                    photoURL: photoURL,
                    ...(user.foundation ? { foundation: user.foundation } : {})
                }
            }
        });

        return {
            success: true
        }
    }

    const startLogout = async () => {
        await logoutFirebase();
        dispatch({type: "logout"});
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                startGoogleSignIn,
                startLoginWithEmailAndPasssword,
                startLogout,
                startCreatingUserWithEmailAndPassword
            }}
        >
            {children}
        </AuthContext.Provider >
    )

}