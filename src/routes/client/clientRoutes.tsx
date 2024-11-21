import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, DashboardClientPage } from "../../pages";
import Campaignspage from "../../pages/CampaignsPage";
import FoundationAdminCreateCampaignPage from "../../pages/client/foundation-admin/CreateCampaign";
import EditFoundationPage from "../../pages/client/foundation-admin/EditFoundation";
import DashboardFoundationPage from "../../pages/DashboardFoundation";
import ProtectedFoundationRoute from "./ProtectedFoundationRoute";



export const clientRoutes = [
    {
        path: "dashboard",
        element: <DashboardClientPage />
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
    {
        path: "my-foundation/:id",
        element: (
            <ProtectedFoundationRoute component={DashboardFoundationPage} />
        )
    },
    {
        path: "my-foundation/edit/:id",
        element: (
            <ProtectedFoundationRoute component={EditFoundationPage} />
        )
    },
    {
        path: "my-foundation/create-campaign/:id",
        element: (
            <ProtectedFoundationRoute component={FoundationAdminCreateCampaignPage} />
        )
    },
];