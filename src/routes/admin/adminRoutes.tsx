import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, CreateCampaignPage, DashboardAdminPage } from "../../pages";
import CreateFoundationPage from "../../pages/admin/CreateFoundation";
import EditCampaignPage from "../../pages/admin/EditCampaign";
import ManagementUsersPage from "../../pages/admin/ManagementUsers";
import PendingCampaignPage from "../../pages/admin/PendingCampaign";
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
        path: "pending-campaigns",
        element: <PendingCampaignPage />
    },
    {
        path: "management-users",
        element: <ManagementUsersPage />
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