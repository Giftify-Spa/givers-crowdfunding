/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { ReactElement, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/auth/AuthContext.tsx';

interface AppStateProps {
    children: ReactElement<any, any> | ReactElement<any, any>[] | ReactNode | null;
}

const AppState: React.FC<AppStateProps> = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppState>
            <App />
        </AppState>
    </React.StrictMode>,
)
