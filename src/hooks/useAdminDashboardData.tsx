import { useState, useEffect, useCallback } from "react";
import { countActiveCampaigns, countExecuteCampaigns, countFinishedCampaigns, countPendingApprovedCampaigns } from "../firebase/services/CampaignServices";
import { countUsers } from "../firebase/services/UserServices";
import { countFoundations } from "../firebase/services/FoundationServices";

const useAdminDashboardData = () => {
    const [data, setData] = useState({
        usersCount: null,
        foundationsCount: null,
        pendingApprovedCampaignsCount: null,
        activeCampaignsCount: null,
        executedCampaignsCount: null,
        finishCampaignsCount: null,
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setData((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const [users, foundations, pending, active, execute, finished] = await Promise.all([
                countUsers(),
                countFoundations(),
                countPendingApprovedCampaigns(),
                countActiveCampaigns(),
                countExecuteCampaigns(),
                countFinishedCampaigns(),
            ]);

            setData({
                usersCount: users,
                foundationsCount: foundations,
                pendingApprovedCampaignsCount: pending,
                activeCampaignsCount: active,
                executedCampaignsCount: execute,
                finishCampaignsCount: finished,
                loading: false,
                error: null,
            });
        } catch (error) {
            setData((prev) => ({
                ...prev,
                loading: false,
                error: "Error al cargar los datos",
            }));
            console.error("Failed to fetch admin dashboard data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...data, refreshData: fetchData };
};

export default useAdminDashboardData;
