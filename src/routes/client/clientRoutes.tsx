import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, DashboardClientPage } from "../../pages";
import Campaignspage from "../../pages/CampaignsPage";



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
];