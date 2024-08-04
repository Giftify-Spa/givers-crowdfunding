
import { Navigate } from "react-router-dom";
import { CreateCampaignPage } from "../../pages";
import CreateFoundationPage from "../../pages/admin/CreateFoundation";
export const giversRoutes = [
    {
        path: "create-campaign",
        element: <CreateCampaignPage />
    },
    {
        path: "create-foundation",
        element: <CreateFoundationPage />
    },
    {
        path: "/panel/*",
        element: <Navigate to={"/panel/dashboard"} />
    }
]