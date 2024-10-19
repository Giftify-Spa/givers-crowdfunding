import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, CreateCampaignPage, DashboardAdminPage } from "../../pages";
import CreateFoundationPage from "../../pages/admin/CreateFoundation";
import EditCampaignPage from "../../pages/admin/EditCampaign";
import Campaignspage from "../../pages/CampaignsPage";



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
        path: "edit-campaign/:id",
        element: <EditCampaignPage />
    },
    {
        path: "create-foundation",
        element: <CreateFoundationPage />
    },
    {
        path: "campaigns",
        element: <GiversLayout>
            <Campaignspage />
        </GiversLayout>
    },
    {
        path: "campaign/:id",
        element: <CampaignDetailsPage />
    },
];