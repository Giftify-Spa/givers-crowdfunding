import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, CreateCampaignPage, DashboardAdminPage } from "../../pages";
import CreateFoundationPage from "../../pages/admin/CreateFoundation";
import EditCampaignPage from "../../pages/admin/EditCampaign";
import EditFoundationPage from "../../pages/admin/EditFoundation";
import ManagementActiveCampaignsPage from "../../pages/admin/ManagementActiveCampaigns";
import ManagementCompletedCampaignsPage from "../../pages/admin/ManagementCompletedCampaigns";
import ManagementExecuteCampaignsPage from "../../pages/admin/ManagementExecuteCampaigns";
import ManagementFoundationsPage from "../../pages/admin/ManagementFoundations";
import ManagementUsersPage from "../../pages/admin/ManagementUsers";
import PendingCampaignPage from "../../pages/admin/PendingCampaign";
import Campaignspage from "../../pages/CampaignsPage";
import ProfileSettings from "../../pages/user/ProfileSettings";



export const adminRoutes = [
    {
        path: "dashboard",
        element: <DashboardAdminPage />
    },
    {
        path: "profile-settings",
        element: <ProfileSettings />
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
        path: "edit-foundation/:id",
        element: <EditFoundationPage />
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
        path: "management-active-campaigns",
        element: <ManagementActiveCampaignsPage />
    },
    {
        path: "management-execute-campaigns",
        element: <ManagementExecuteCampaignsPage />
    },
    {
        path: "management-completed-campaigns",
        element: <ManagementCompletedCampaignsPage />
    },
    {
        path: "management-foundations",
        element: <ManagementFoundationsPage />
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