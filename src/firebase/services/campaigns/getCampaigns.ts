/* eslint-disable @typescript-eslint/no-explicit-any */
import { Campaign } from "../../../interfaces/Campaign";
import { Foundation } from "../../../interfaces/Foundation";
import { User } from "../../../interfaces/User";

import { FirebaseDB } from "../../config";
import {
    collection,
    query,
    getDocs,
    where,
    getDoc,
    limit as firestorelimit,
    QueryDocumentSnapshot,
    DocumentData,
    DocumentReference,
    startAfter,
    orderBy,
    doc,
    updateDoc,
} from "firebase/firestore";



/**
 * Helper function to map campaign data, including foundation and createdBy details.
 * @param {QueryDocumentSnapshot<DocumentData>} doc - The document snapshot to map.
 * @returns {Promise<Campaign | null>} A promise that resolves to the campaign object or null if mapping fails.
 */
const mapCampaignData = async (doc: QueryDocumentSnapshot<DocumentData>): Promise<Campaign | null> => {
    try {
        const data = doc.data() as Campaign;
        const { foundation, createdBy } = data;

        // Validar que foundation y createdBy sean DocumentReferences
        if (!(foundation instanceof DocumentReference)) {
            console.error(`El campo 'foundation' no es una referencia válida en el documento ${doc.id}`);
            return null;
        }

        if (!(createdBy instanceof DocumentReference)) {
            console.error(`El campo 'createdBy' no es una referencia válida en el documento ${doc.id}`);
            return null;
        }

        // Fetch related data for foundation and createdBy in parallel
        const [foundationDoc, userDoc] = await Promise.all([
            getDoc(foundation as DocumentReference),
            getDoc(createdBy as DocumentReference)
        ]);
        const foundationData = foundationDoc.exists() ? (foundationDoc.data() as Foundation) : null;
        const userData = userDoc.exists() ? (userDoc.data() as User) : null;

        return {
            id: doc.id,
            ...data,
            foundation: foundationData,
            createdBy: userData,
        };
    } catch (error) {
        console.error("Error mapping campaign data: ", error);
        return null;
    }
};


/**
 * Fetches a list of campaigns with an optional limit on the number of results.
 * @param {number} limit - Maximum number of campaigns to retrieve (optional).
 * @returns {Promise<Campaign[]>} A promise that resolves to an array of campaign objects.
 */
export const getCampaigns = async (limit: number): Promise<Campaign[]> => {
    try {
        const baseQuery = query(
            collection(FirebaseDB, "campaigns"),
            where("status", "==", true),
            ...(limit > 0 ? [firestorelimit(limit)] : []) // Apply limit if specified
        );

        const querySnapshot = await getDocs(baseQuery);
        const campaignsPromises = querySnapshot.docs.map(mapCampaignData);
        const campaigns = await Promise.all(campaignsPromises);

        // Filter out null values in case of mapping errors
        return campaigns.filter(Boolean) as Campaign[];
    } catch (error) {
        console.error("Error getting campaigns: ", error);
        return [];
    }
};


/**
 * Fetches a paginated list of campaigns from Firestore based on status and other filters.
 * @param {number} limit - The number of campaigns per page.
 * @param {boolean} isExecute - Filter for execute status.
 * @param {boolean} isFinished - Filter for finished status.
 * @param {boolean} status - Filter for approval status.
 * @param {QueryDocumentSnapshot<DocumentData> | null} lastDoc - The last document from the previous page (for pagination).
 * @returns {Promise<{ campaigns: Campaign[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }>} 
 * A promise that resolves to an object containing the array of campaign objects and the last document.
 */
export const getPaginatedCampaignsByStatus = async (
    limit: number, 
    isExecute: boolean,
    isFinished: boolean,
    status: boolean, 
    lastDoc: any = null
): Promise<{ campaigns: Campaign[], lastDoc: any }> => {
    try {
        // Construye la consulta Firestore con filtros y paginación
        let baseQuery = query(
            collection(FirebaseDB, "campaigns"),
            where("delete", "==", false),
            where("isExecute", "==", isExecute),
            where("isFinished", "==", isFinished),
            where("status", "==", status),
            orderBy("name"), // Ordena por nombre para paginación
            ...(limit > 0 ? [firestorelimit(limit)] : []) // Apply limit if specified
        );

        // Si lastDoc existe, agrégalo a la consulta
        if (lastDoc) {
            baseQuery = query(baseQuery, startAfter(lastDoc));
        }

        // Ejecuta la consulta y obtiene los documentos
        const querySnapshot = await getDocs(baseQuery);

        const campaignPromises = querySnapshot.docs.map(async (doc) => {
            const data = doc.data() as Campaign;
            const {
                name,
                description,
                cumulativeAmount,
                requestAmount,
                isCause,
                isExperience,
                donorsCount,
                category,
                status,
                responsible,
                initVideo
            } = data;

            // Obtain Responsible
            const responsibleDoc = await getDoc(responsible);
            const responsibleData = responsibleDoc.exists() ? responsibleDoc.data() as User : null;

            return {
                id: doc.id,
                name,
                description,
                cumulativeAmount,
                requestAmount,
                isCause,
                isExperience,
                donorsCount,
                category,
                responsible: { id: responsibleDoc.id, ...responsibleData },
                status,
                initVideo
            };
        });

        const campaigns = await Promise.all(campaignPromises);

        return {
            campaigns,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        };
    } catch (error) {
        console.error("Error fetching paginated campaigns:", error);
        return { campaigns: [], lastDoc: null };
    }
};

/**
 * Fetches campaigns by type with pagination support.
 * @param {'cause' | 'experience'} type - Type of campaign to fetch ('cause' or 'experience').
 * @param {QueryDocumentSnapshot<DocumentData>} [lastDoc] - The last document from a previous fetch to paginate results.
 * @returns {Promise<{ campaigns: Campaign[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }>}
 * An object containing the fetched campaigns and the last visible document for pagination.
 */
export const getCampaignsByType = async (
    type: 'cause' | 'experience',
    lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ campaigns: Campaign[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
    try {
        // Base query with filters based on campaign type
        const baseQuery = query(
            collection(FirebaseDB, "campaigns"),
            where("status", "==", true),
            where(type === 'cause' ? "isCause" : "isExperience", "==", true),
            ...(lastDoc ? [startAfter(lastDoc)] : []), // Apply pagination if lastDoc is provided
            firestorelimit(100)
        );

        const querySnapshot = await getDocs(baseQuery);
        const campaignsPromises = querySnapshot.docs.map(mapCampaignData);
        const campaigns = await Promise.all(campaignsPromises);

        // Get the last visible document for pagination, or null if no results
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        return { campaigns: campaigns.filter(Boolean) as Campaign[], lastVisible };
    } catch (error) {
        console.error("Error getting campaigns by type: ", error);
        return { campaigns: [], lastVisible: null };
    }
};

/**
 * Fetches all pending campaigns from Firestore where status is false.
 * For each campaign, it also retrieves the associated foundation and creator (user) data.
 *
 * @returns {Promise<Campaign[]>} An array of Campaign objects with detailed foundation and creator information.
 */
export const getPendingCampaigns = async (): Promise<Campaign[]> => {
    try {
        // Reference to the "campaigns" collection in Firestore
        const campaignsRef = collection(FirebaseDB, "campaigns");

        // Create a query to fetch campaigns with status == false (pending)
        const pendingQuery = query(campaignsRef, where("status", "==", false), where("delete", "==", false));

        // Execute the query and get the snapshot
        const querySnapshot = await getDocs(pendingQuery);

        // Map over each document in the snapshot to construct Campaign objects
        const campaignsPromises = querySnapshot.docs.map(async (docSnapshot) => {
            // Extract campaign data from the document
            const data = docSnapshot.data() as Campaign;

            // Extract DocumentReferences for foundation and createdBy from campaign data
            const foundationRef = data.foundation as DocumentReference | undefined;
            const createdByRef = data.createdBy as DocumentReference | undefined;

            // Verify that both references exist
            if (!foundationRef || !createdByRef) {
                console.warn(`Campaign with ID ${docSnapshot.id} is missing foundation or createdBy references.`);
                return null; // Optionally handle incomplete data as needed
            }

            try {
                // Fetch foundation and user data in parallel
                const [foundationDoc, userDoc] = await Promise.all([
                    getDoc(foundationRef),
                    getDoc(createdByRef)
                ]);

                // Extract foundation data if it exists
                const foundationData = foundationDoc.exists() ? (foundationDoc.data() as Foundation) : null;

                // Extract user data if it exists
                const userData = userDoc.exists() ? (userDoc.data() as User) : null;

                // Return the complete Campaign object
                return {
                    id: docSnapshot.id, // Use Firestore document ID
                    ...data, // Spread the rest of the campaign data
                    foundation: foundationData,
                    createdBy: userData,
                };
            } catch (error) {
                console.error(`Error fetching related documents for campaign ID ${docSnapshot.id}:`, error);
                return null; // Optionally handle errors as needed
            }
        });

        // Await all campaign promises to resolve
        const campaignsWithDetails = await Promise.all(campaignsPromises);

        // Filter out any null results due to missing references or errors
        const validCampaigns = campaignsWithDetails.filter((campaign) => campaign !== null);

        return validCampaigns;
    } catch (error) {
        console.error("Error fetching pending campaigns:", error);
        return []; // Return an empty array in case of a general error
    }
};

/**
 * Approves a campaign by updating its status to true.
 * @param {string} campaignId - The ID of the campaign to approve.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
 */
export const getApproveCampaigns = async (campaignId: string): Promise<{ success: boolean }> => {
    try {
        const campaignRef = doc(FirebaseDB, "campaigns", campaignId);
        await updateDoc(campaignRef, { status: true });
        return { success: true };
    } catch (error) {
        console.error("Error approving campaign:", error);
        return { success: false };
    }
};


/**
 * Fetches campaigns associated with a specific foundation.
 *
 * @param {string} id - The ID of the foundation.
 * @returns {Promise<Campaign[]>} - A promise that resolves to an array of campaigns.
 *
 * @throws Will log an error and return an empty array if the fetching process fails.
 *
 * @example
 * const campaigns = await getCampaignsWithFoundation('foundationId');
 * console.log(campaigns);
 */
export const getCampaignsWithFoundation = async (id: string): Promise<Campaign[]> => {
    try {
        // Reference the user's document in the 'foundations' collection
        const Ref = doc(FirebaseDB, 'foundations', id);
        const foundationDoc = await getDoc(Ref);
        const foundation = foundationDoc.data();

        // Fetch all campaigns in parallel using Promise.all
        const campaignsPromises = foundation.campaigns.map((campaignId: string) => {
            const campaignRef = doc(FirebaseDB, "campaigns", campaignId);
            return getDoc(campaignRef);
        });

        // Wait for all campaign documents to be fetched
        const campaignsDocs = await Promise.all(campaignsPromises);


        // Map the fetched campaigns to the required format
        const campaigns = await Promise.all(campaignsDocs.map(async (campaignDoc) => {
            if (!campaignDoc.exists()) {
                console.warn(`Campaign not found: ${campaignDoc.id}`);
                return null; // O Return null or handle is another way as needed
            }

            // Extract campaign data
            const {
                name,
                description,
                initDate,
                initVideo,
                endDate,
                isCause,
                isExperience,
                isExecute,
                isFinished,
                cumulativeAmount,
                requestAmount,
                donorsCount,
                multimedia,
                foundation,
                category,
                responsible,
                createdAt,
                status
            } = campaignDoc.data();

            return {
                id: campaignDoc.id,
                name,
                description,
                initDate,
                initVideo,
                endDate,
                isCause,
                isExperience,
                isExecute,
                isFinished,
                cumulativeAmount,
                requestAmount,
                donorsCount,
                multimedia,
                foundation,
                category,
                responsible,
                createdAt,
                status
            };
        }));

        console.log(campaigns);
        // Filter out any null value campaigns array
        return campaigns.filter(campaign => campaign !== null);

    } catch (error) {
        console.log(error);
        return []
    }
}
