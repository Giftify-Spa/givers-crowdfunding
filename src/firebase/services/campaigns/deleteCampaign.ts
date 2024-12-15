import { FirebaseDB } from "../../config";
import { doc, updateDoc } from "firebase/firestore";


/**
 * Deleted a campaign by updating its status to false.
 * @param {string} campaignId - The ID of the campaign to delete.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
 */
export const deleteCampaign = async (campaignId: string): Promise<{ success: boolean }> => {
    try {
        const campaignRef = doc(FirebaseDB, "campaigns", campaignId);
        await updateDoc(campaignRef, { delete: false });
        return { success: true };
    } catch (error) {
        console.error("Error deleting campaign:", error);
        return { success: false };
    }
};