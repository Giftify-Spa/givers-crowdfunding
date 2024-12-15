import { useState, useEffect, useCallback } from "react";
import { countActiveCampaigns, countExecuteCampaigns, countFinishedCampaigns, countPendingApprovedCampaigns } from "../firebase/services/campaigns/index";
import { countUsers } from "../firebase/services/UserServices";
import { countFoundations } from "../firebase/services/FoundationServices";

/**
 * Custom hook to fetch and manage admin dashboard data.
 *
 * @returns {Object} The admin dashboard data.
 * - `usersCount` (number | null): The count of users.
 * - `foundationsCount` (number | null): The count of foundations.
 * - `pendingApprovedCampaignsCount` (number | null): The count of pending approved campaigns.
 * - `activeCampaignsCount` (number | null): The count of active campaigns.
 * - `executedCampaignsCount` (number | null): The count of executed campaigns.
 * - `finishCampaignsCount` (number | null): The count of finished campaigns.
 * - `loading` (boolean): Indicates if the data is currently being loaded.
 * - `error` (string | null): Error message if data fetching fails.
 * - `refreshData` (Function): Function to manually refresh the data.
 */

interface AdminDashboardData {
    usersCount: number;
    foundationsCount: number;
    pendingApprovedCampaignsCount: number;
    activeCampaignsCount: number;
    executedCampaignsCount: number;
    finishCampaignsCount: number;
    loading: boolean;
    error: string| null;
    refreshData: () => void;
  }

const useAdminDashboardData = (): AdminDashboardData => {
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
