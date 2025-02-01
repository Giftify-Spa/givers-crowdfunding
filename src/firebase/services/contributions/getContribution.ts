/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../../../interfaces/User";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseDB } from "../../config";
import { Contribution } from "../../../interfaces/Contribution";
import { Campaign } from "../../../interfaces/Campaign";


/**
 * Fetches a single campaign by its ID, along with related data for foundation, responsible user, and category.
 * @param {string} id - The ID of the campaign to retrieve.
 * @returns {Promise< Contribution | null>}
 * A promise that resolves to the campaign object with related data or null if the campaign doesn't exist.
 */
export const getContribution = async (id: string): Promise<Contribution | null> => {
    try {
        const docRef = doc(FirebaseDB, "contributions", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const {
                orderNumber,
                name,
                lastname,
                email,
                amount,
                userId,
                campaignId,
                foundationId,
                payment,
                os,
                createdAt,
                mp_preference_id,
                mp_response,
            } = docSnapshot.data();

            const campaignRef = doc(FirebaseDB, "campaigns", campaignId);
            const userRef = doc(FirebaseDB, "users", userId);
            const foundationRef = doc(FirebaseDB, "foundations", foundationId);

            // Fetch related Campaign and User documents in parallel
            const [campaignDoc, userDoc, foundationDoc] = await Promise.all([
                getDoc(campaignRef),
                getDoc(userRef),
                getDoc(foundationRef)
            ]);

            // Extract related data if the documents exist
            const campaignData = campaignDoc?.exists() ? (campaignDoc.data() as Campaign) : null;
            const userData = userDoc?.exists() ? (userDoc.data() as User) : null;
            const foundationData = foundationDoc?.exists() ? (foundationDoc.data() as any) : null;

            return {
                id: docSnapshot.id,
                orderNumber,
                name,
                lastname,
                email,
                amount,
                userId,
                campaignId,
                foundationId,
                payment,
                os,
                createdAt,
                mp_preference_id,
                mp_response,
                user: userData,
                campaign: campaignData,
                foundation: foundationData,
            };
        } else {
            console.error("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting campaign document: ", error);
        return null;
    }
};