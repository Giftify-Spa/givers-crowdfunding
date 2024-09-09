import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, CausesPage, CreateCampaignPage, DashboardAdminPage, ExperiencesPage } from "../../pages";
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
    {
        path: "causes",
        element: <GiversLayout>
            <CausesPage />
        </GiversLayout>
    },
    {
        path: "experiences",
        element: <GiversLayout>
            <ExperiencesPage />
        </GiversLayout>
    },
    {
        path: "campaign/:id",
        element: <CampaignDetailsPage />
    },
];