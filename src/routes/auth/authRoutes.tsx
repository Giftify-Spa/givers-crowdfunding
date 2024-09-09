import { Navigate } from "react-router-dom";
import LoginPage from "../../pages/auth/Login";
import RegisterPage from "../../pages/auth/Register";
import { CampaignDetailsPage, CausesPage, HomeLanding } from "../../pages";
import ExperiencesPage from "../../pages/Experiences";
import GiversLayoutGuest from "../../layout/GiversLayoutGuest";



export const authRoutes = [
    {
        path: "",
        element: <HomeLanding />
    },
    {
        path: "login",
        element: <LoginPage />
    },
    {
        path: "register",
        element: <RegisterPage />
    },
    {
        path: "causes",
        element: <GiversLayoutGuest>
            <CausesPage />
        </GiversLayoutGuest>
    },
    {
        path: "experiences",
        element: <GiversLayoutGuest>
            <ExperiencesPage />
        </GiversLayoutGuest>
    },
    {
        path: "campaign/:id",
        element: <CampaignDetailsPage />
    },
    {
        path: "/*",
        element: <Navigate to={""} />
    }
]