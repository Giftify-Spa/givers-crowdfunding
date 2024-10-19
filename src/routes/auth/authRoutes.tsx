import { Navigate } from "react-router-dom";
import LoginPage from "../../pages/auth/Login";
import RegisterPage from "../../pages/auth/Register";
import { CampaignDetailsPage, HomeLanding } from "../../pages";
import GiversLayoutGuest from "../../layout/GiversLayoutGuest";
import Campaignspage from "../../pages/CampaignsPage";
import FoundationPage from "../../pages/Foundation";



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
        path: "campaigns",
        element: <GiversLayoutGuest>
            <Campaignspage />
        </GiversLayoutGuest>
    },
    {
        path: "foundation/:id",
        element: <GiversLayoutGuest>
            <FoundationPage />
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