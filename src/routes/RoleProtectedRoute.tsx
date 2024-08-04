/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react"
import { AuthContext } from "../context/auth/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navigate } from "react-router-dom";


interface RoleProtectedRouteProps {
    component: React.ComponentType<any>;
    allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ component: Component, allowedRoles, ...rest }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || !allowedRoles.includes(user.profile)) {
        return <Navigate to="/" />
    }

    if (!allowedRoles.includes(user.profile)) {
        // Redirect dashboard with especific role
        const dashboardPath = user.profile === 'Admin' ? '/admin/dashboard' : '/panel/dashboard';
        return <Navigate to={dashboardPath} />
    }

    return <Component {...rest} />;
}

export default RoleProtectedRoute
