import GiversLayout from "../../layout/GiversLayout";
import { CampaignDetailsPage, CausesPage, DashboardClientPage, ExperiencesPage } from "../../pages";



export const clientRoutes = [
    {
        path: "dashboard",
        element: <DashboardClientPage />
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