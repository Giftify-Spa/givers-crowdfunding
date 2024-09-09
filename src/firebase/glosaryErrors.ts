


export const glosaryErrors = [
    {
        key: "Firebase: Error (auth/invalid-email).",
        en: "Invalid Email.",
        es: "Correo electrónico inválido."
    },
    {
        key: "Firebase: Error (auth/missing-password).",
        en: "Missing password.",
        es: "El campo contraseña es requerido."
    },
    {
        key: "Firebase: Error (auth/user-not-found).",
        en: "User not found.",
        es: "Usuario no encontrado."
    },
    {
        key: "Firebase: Error (auth/wrong-password).",
        en: "Wrong password.",
        es: "Contraseña incorrecta."
    },
    {
        key: "Firebase: Error (auth/invalid-credential).",
        en: "Invalid credential.",
        es: "Credenciales inválidas."
    },
    {
        key: "Firebase: Error (auth/email-already-in-use).",
        en: "The email entered is already in use.",
        es: "El correo electrónico ingresado ya esta en uso."
    }
]

export const findError = (errorKey: string) => {
    const existError = glosaryErrors.find(error => error.key === errorKey);
    if (!existError) {
        return {
            en: "An error occurred.",
            es: "Ocurrió un error."
        }
    }
    return existError;
}