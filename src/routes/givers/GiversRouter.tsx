import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../context/auth/AuthContext";

export const GiversRouter = () => {
    const { status } = useContext(AuthContext);
    if (status === "not-authenticated" || status === "checking") return <Navigate to={""} />;

    return <Outlet />;
}
