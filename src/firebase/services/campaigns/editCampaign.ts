/* eslint-disable @typescript-eslint/no-unused-vars */
import { Campaign } from "../../../interfaces/Campaign";
import { ICampaignResponse } from "../../../types";

import { FirebaseDB } from "../../config";
import { doc, getDoc, updateDoc } from "firebase/firestore";


/**
 * Edits an existing campaign in the Firestore database.
 *
 * @param {string} id - The ID of the campaign to edit.
 * @param {Campaign} data - The updated campaign data.
 * @param {string} user - The user performing the edit operation.
 * @returns {Promise<ICampaignResponse>} - A promise that resolves to an object indicating the success or failure of the operation.
 *
 * @throws Will throw an error if the campaign does not exist or if there is an issue updating the campaign.
 */
export const editCampaign = async (id: string, data: Campaign): Promise<ICampaignResponse> => {
    try {
        const {
            name,
            description,
            requestAmount,
        } = data;

        // Reference to the existing campaign document
        const campaignRef = doc(FirebaseDB, 'campaigns', id);
        const campaignSnap = await getDoc(campaignRef);

        if (!campaignSnap.exists()) {
            console.error("Campaign does not exist");
            return { success: false, message: "Foundation does not exist" };
        }

        const updatedCampaignData: Partial<Campaign> = {
            name,
            description,
            requestAmount,
        };

        // Update the campaign document in Firestore
        await updateDoc(campaignRef, updatedCampaignData);

        return { success: true };
    } catch (error) {
        console.error("Error adding campaign: ", error);
        return { success: false };
    }
};


/**
 * Toggles a campaign's status (enables or disables) by updating their status in Firestore.
 * @param {string} campaignId - The ID of the campaign.
 * @param {boolean} status - The desired status for the campaign (true to enable, false to disable).
 * @returns {Promise<void>} - A promise that resolves when the campaign's status is updated.
 * @throws {Error} - If there is an issue updating the campaign status.
 */
export const toggleCampaignStatus = async (campaignId: string, status: boolean): Promise<void> => {
    try {
        // Reference the specific foundation's document in Firestore
        const campaignRef = doc(FirebaseDB, 'campaigns', campaignId);

        // Update the foundation's status in Firestore
        await updateDoc(campaignRef, {
            status: status,
        });
    } catch (error) {
        console.error(`Error ${status ? 'enabling' : 'disabling'} campaign:`, error);
        throw new Error(`Unable to ${status ? 'enable' : 'disable'} the campaign. Please try again later.`);
    }
};