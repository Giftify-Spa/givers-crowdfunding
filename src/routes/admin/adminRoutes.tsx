import { CreateCampaignPage, DashboardAdminPage } from "../../pages";
import CreateFoundationPage from "../../pages/admin/CreateFoundation";



export const adminRoutes = [
    {
        path: "dashboard",
        element: <DashboardAdminPage />
    },
    {
        path: "create-campaign",
        element: <CreateCampaignPage />
    },
    {
        path: "create-foundation",
        element: <CreateFoundationPage />
    },
];