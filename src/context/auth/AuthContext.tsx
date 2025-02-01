/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useReducer } from "react";
import { AuthState, authReducer } from "./authReducer";

import { loginWithEmailAndPassword, logoutFirebase } from "../../firebase/providers";
import { User } from '../../interfaces/User';
import { addDocument, checkIfDocumentExists } from "../../firebase/service";
import { getUserByEmail, getUserByUid } from "../../firebase/services/UserServices";
import { AuthResponse } from "../../interfaces/AuthResponse";
import { registerUserWithEmailAndPassword } from "../../firebase/providers";
import { onAuthStateChanged, GoogleAuthProvider, fetchSignInMethodsForEmail, signInWithPopup, getAuth } from "firebase/auth";
import { FirebaseAuth } from "../../firebase/config";
import { updateDoc } from "firebase/firestore";

type AuthContextProps = {
    user: User | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    startGoogleSignIn: () => void,
    startLoginWithEmailAndPasssword: (email: string, password: string) => Promise<AuthResponse>,
    startLogout: () => void,
    startCreatingUserWithEmailAndPassword: (email: string, password: string, name: string) => Promise<AuthResponse>
    refreshUser: (user: User) => Promise<AuthResponse>
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
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FirebaseAuth, async (authUser) => {
            if (authUser) {
                const user = await getUserByUid(authUser.uid);

                if (user) {
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
                } else {
                    dispatch({
                        type: "not-authenticated"
                    });
                }
            } else {
                dispatch({
                    type: "not-authenticated"
                });
            }
        });

        return () => unsubscribe();
    }, []);



    const startGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Inicio de sesión exitoso con Google.
            // Aquí puedes verificar si el usuario existe en la DB y si no, crearlo.

            const { user: googleUser } = result;
            const { uid, email, displayName, photoURL } = googleUser;

            // Verificar si existe en la base de datos.
            const existUser = await checkIfDocumentExists('users', 'uid', uid);
            if (!existUser && email) {
                // Crear el usuario en la DB
                const userData = {
                    uid: uid,
                    name: displayName,
                    email: email,
                    status: true,
                    profile: 'Client',
                    photoURL
                }
                await addDocument('users', userData);
            }

            const dbUser = await getUserByUid(uid);
            if (dbUser) {
                dispatch({
                    type: "auth",
                    payload: {
                        user: {
                            id: dbUser.id,
                            uid: dbUser.uid,
                            name: dbUser.name,
                            email: dbUser.email,
                            status: dbUser.status,
                            profile: dbUser.profile,
                            photoURL: dbUser.photoURL,
                            ...(dbUser.foundation ? { foundation: dbUser.foundation } : {})
                        }
                    }
                });
            } else {
                dispatch({ type: "not-authenticated" });
            }

        } catch (error: any) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const email = error.customData?.email;
                if (!email) return; // No se puede continuar sin email

                const methods = await fetchSignInMethodsForEmail(auth, email);

                if (methods.includes('password')) {
                    // El usuario ya tiene una cuenta con email/contraseña.
                    // Pídele que inicie sesión con su email y contraseña.
                    console.log('La cuenta ya existe con este email usando correo/contraseña. Inicia sesión con ese método primero.');

                    // Después de que el usuario inicie sesión con email/contraseña,
                    // intentaremos vincular usando `pendingCredential`.
                } else {
                    console.log('Este email está asociado a otro proveedor distinto de password:', methods);
                }
            } else {
                console.error('Error al iniciar sesión con Google:', error);
            }
        }
    }

    const startCreatingUserWithEmailAndPassword = async (name: string, email: string, password: string): Promise<AuthResponse> => {

        try {
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

            let userCheck = await getUserByUid(uid);

            if (!userCheck) {
                // Format user data
                const userData = {
                    id: (userCheck) ? userCheck.id : '',
                    uid,
                    name: displayName,
                    email: userEmail,
                    status: true,
                    profile: 'Client',
                    photoURL,
                }
                // Search user in the DB with the uid
                const existUser = await checkIfDocumentExists('users', 'uid', uid);

                if (!existUser) {
                    // check temporal user
                    const existUserEmail = await checkIfDocumentExists('users', 'email', userData.email);

                    if (!existUserEmail) {
                        // Save user in the DB
                        await addDocument('users', userData);
                        // dispatch({
                        //     type: "auth",
                        //     payload: {
                        //         user: {
                        //             ...userData,
                        //         }
                        //     }
                        // });

                        // return {
                        //     success: true
                        // }
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

                userCheck = await getUserByUid(uid);
            }

            if (!userCheck) {
                dispatch({ type: "not-authenticated" });
                return { success: false, errorMessage: "User not found after creation." };
            }

            dispatch({
                type: "auth",
                payload: {
                    user: {
                        id: userCheck.id,
                        uid: userCheck.uid,
                        name: userCheck.name,
                        email: userCheck.email,
                        status: userCheck.status,
                        profile: userCheck.profile,
                        photoURL: userCheck.photoURL,
                        ...(userCheck.foundation ? { foundation: userCheck.foundation } : {})
                    }
                }
            });

            return {
                success: true,
            }

        } catch (error) {
            console.error("Error creating user with email and password:", error);
            dispatch({ type: "not-authenticated" });
            return { success: false, errorMessage: error.message };
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
        dispatch({ type: "logout" });
    }

    const refreshUser = async (user: User): Promise<AuthResponse> => {
        try {
            dispatch({
                type: "refresh-user",
                payload: {
                    user: {
                        ...user,
                        rut: user.rut,
                        lastname: user.lastname,
                        name: user.name,
                        phone: user.phone,
                    }
                }
            });

            return {
                success: true
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                startGoogleSignIn,
                startLoginWithEmailAndPasssword,
                startLogout,
                startCreatingUserWithEmailAndPassword,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider >
    )
};