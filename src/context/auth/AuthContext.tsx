/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { AuthState, authReducer } from "./authReducer";

import { signInWithGoogle, loginWithEmailAndPassword, logoutFirebase } from "../../firebase/providers";
import { User } from '../../interfaces/User';
import { addDocument, checkIfDocumentExists, getUserByUid } from "../../firebase/service";
import { AuthResponse } from "../../interfaces/AuthResponse";
import { registerUserWithEmailAndPassword } from "../../firebase/providers";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "../../firebase/config";
import LoadingSpinner from "../../components/LoadingSpinner";

type AuthContextProps = {
    user: User | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    loading: boolean,
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
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FirebaseAuth, async (authUser) => {
            if (authUser) {

                const user = await getUserByUid(authUser.uid);

                dispatch({
                    type: "auth",
                    payload: {
                        user: {
                            uid: user.uid,
                            name: user.name,
                            email: user.email,
                            status: user.status,
                            profile: user.profile,
                            photoURL: user.photoURL
                        }
                    }
                });
            }
            setLoading(false);
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
                    photoURL: user.photoURL
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

        // Format user data
        const userData = {
            uid,
            name: displayName,
            email: userEmail,
            status: true,
            profile: 'Client',
            photoURL
        }

        // Search user in the DB with the uid
        const existUser = await checkIfDocumentExists('users', 'uid', uid);

        if (!existUser) {
            // Save user in the DB
            await addDocument('users', userData);
            dispatch({
                type: "auth",
                payload: {
                    user: userData
                }
            });

            return {
                success: true
            }
        }

        const user = await getUserByUid(userData.uid);

        dispatch({
            type: "auth",
            payload: {
                user: {
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    profile: user.profile,
                    photoURL: user.photoURL
                }
            }
        });

        return {
            success: true,
        }
    }

    const startLoginWithEmailAndPasssword = async (emailUser: string, password: string): Promise<AuthResponse> => {

        const { success, displayName, email, uid, photoURL, errorMessage } = await loginWithEmailAndPassword(emailUser, password);

        if (!success) {
            dispatch({
                type: "not-authenticated",
            });

            return {
                success,
                errorMessage
            };
        }

        dispatch({
            type: "auth",
            payload: {
                user: {
                    uid,
                    name: displayName,
                    email,
                    status: true,
                    profile: 'Client',
                    photoURL: photoURL
                }
            }
        });
    }

    const startLogout = async () => {
        await logoutFirebase();

        dispatch({
            type: "logout"
        });
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                loading,
                startGoogleSignIn,
                startLoginWithEmailAndPasssword,
                startLogout,
                startCreatingUserWithEmailAndPassword
            }}
        >

            {loading ? <LoadingSpinner /> : children}
        </AuthContext.Provider >
    )

}