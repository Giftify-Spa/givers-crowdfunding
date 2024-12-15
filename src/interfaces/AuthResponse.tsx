/* eslint-disable @typescript-eslint/no-explicit-any */



/**
 * @interface AuthResponse
 * @property {boolean} success - Indicates if the authentication was successful.
 * @property {any} [user] - The user data.
 * @property {string} [errorCode] - The error code.
 * @property {string} [errorMessage] - The error message.
 */
export interface AuthResponse {
    success: boolean;
    user?: any;
    errorCode?: string;
    errorMessage?: string;
}