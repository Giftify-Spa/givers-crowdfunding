/* eslint-disable @typescript-eslint/no-explicit-any */



export interface AuthResponse {
    success: boolean;
    user?: any;
    errorCode?: string;
    errorMessage?: string;
}