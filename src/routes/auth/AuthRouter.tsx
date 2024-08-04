import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../context/auth/AuthContext";

export const AuthRouter = () => {
    const { status, user } = useContext(AuthContext);

    if (status === 'authenticated') {
        const redirectTo = user?.profile === 'Admin' ? '/admin/dashboard' : '/panel/dashboard';
        return <Navigate to={redirectTo} />
    }
    return <Outlet />;

}
