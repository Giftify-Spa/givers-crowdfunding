import { FirebaseDB } from "../../config";
import { collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";


/**
 * Counts the number of active campaigns that are not yet executed or finished.
 * @returns {Promise<number>} A promise that resolves to the count of active campaigns.
 */
export const countActiveCampaigns = async (): Promise<number> => {
    try {
        const activeQuery = query(
            collection(FirebaseDB, 'campaigns'),
            where('status', '==', true),
            where('isExecute', '==', false),
            where('isFinished', '==', false)
        );

        // Get document count directly from Firestore server without fetching all documents
        const snapshot = await getCountFromServer(activeQuery);

        return snapshot.data().count;
    } catch (error) {
        console.error("Error counting active campaigns: ", error);
        throw new Error("Could not count active campaigns");
    }
};

/**
 * Counts the number of execute campaigns that are not yet actived or finished.
 * @returns {Promise<number>} A promise that resolves to the count of active campaigns.
 */
export const countExecuteCampaigns = async (): Promise<number> => {
    try {
        const activeQuery = query(
            collection(FirebaseDB, 'campaigns'),
            where('isExecute', '==', true),
            where('isFinished', '==', false)
        );

        // Get document count directly from Firestore server without fetching all documents
        const snapshot = await getCountFromServer(activeQuery);
        return snapshot.data().count;
    } catch (error) {
        console.error("Error counting execute campaigns: ", error);
        throw new Error("Could not count execute campaigns");
    }
};

/**
 * Counts the number of finished campaigns.
 * @returns {Promise<string>} A promise that resolves to the count of finished campaigns as a string.
 */
export const countFinishedCampaigns = async (): Promise<string> => {
    try {
        const finishedQuery = query(
            collection(FirebaseDB, 'campaigns'),
            where('isFinished', '==', true)
        );

        const snapshot = await getCountFromServer(finishedQuery);
        return snapshot.data().count.toString();
    } catch (error) {
        console.error("Error counting finished campaigns: ", error);
        throw new Error("Could not count finished campaigns");
    }
};

/**
 * Counts the number of pending approved campaigns.
 * @returns {Promise<string>} A promise that resolves to the count of pending campaigns.
 */
export const countPendingApprovedCampaigns = async (): Promise<string> => {
    try {
        const pendingQuery = query(
            collection(FirebaseDB, 'campaigns'),
            where("status", "==", false)
        );

        const pendingSnapshot = await getDocs(pendingQuery);
        return pendingSnapshot.size.toString();
    } catch (error) {
        console.error("Error counting pending approved campaigns: ", error);
        throw new Error("Could not count pending campaigns");
    }
};