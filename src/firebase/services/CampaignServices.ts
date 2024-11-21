/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts
import { Campaign } from "../../interfaces/Campaign";
import { Foundation } from "../../interfaces/Foundation";
import { User } from "../../interfaces/User";
import { FirebaseDB } from "../config";
import {
    collection,
    query,
    getDocs,
    where,
    getDoc,
    doc,
    limit as firestoreLimit,
    startAfter,
    addDoc,
    getCountFromServer,
    updateDoc,
    QueryDocumentSnapshot,
    DocumentData,
    Timestamp,
    DocumentReference,
} from "firebase/firestore";
import { Category } from "../../interfaces/Category";
import { addTwoMonths } from "../../helpers/addTwoMonths";

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
 * Fetches a single campaign by its ID, along with related data for foundation, responsible user, and category.
 * @param {string} id - The ID of the campaign to retrieve.
 * @returns {Promise<{ id: string; name: string; description: string; initDate: string; initVideo: string; endDate: string; isCause: boolean; isExperience: boolean; isFinished: boolean; cumulativeAmount: number; requestAmount: number; donorsCount: number; multimedia: any[]; foundation: Foundation | null; responsible: User | null; category: Category | null; createdAt: Date | null } | null>}
 * A promise that resolves to the campaign object with related data or null if the campaign doesn't exist.
 */
export const getCampaign = async (id: string): Promise<{
    id: string;
    name: string;
    description: string;
    initDate: string;
    initVideo: string;
    endDate: string;
    isCause: boolean;
    isExperience: boolean;
    isFinished: boolean;
    cumulativeAmount: number;
    requestAmount: number;
    donorsCount: number;
    multimedia: any[];
    foundation: Foundation | null;
    responsible: User | null;
    category: Category | null;
    createdAt: Timestamp | null;
} | null> => {
    try {
        const docRef = doc(FirebaseDB, "campaigns", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const {
                name,
                description,
                initDate,
                initVideo,
                endDate,
                isCause,
                isExperience,
                isFinished,
                cumulativeAmount,
                requestAmount,
                donorsCount,
                multimedia,
                foundation,
                category,
                responsible,
                createdAt,
            } = docSnapshot.data();

            // Fetch related Foundation, User, and Category documents in parallel
            const [foundationDoc, userDoc, categoryDoc] = await Promise.all([
                getDoc(foundation),
                getDoc(responsible),
                getDoc(category),
            ]);

            // Extract related data if the documents exist
            const foundationData = foundationDoc?.exists() ? (foundationDoc.data() as Foundation) : null;
            const userData = userDoc?.exists() ? (userDoc.data() as User) : null;
            const categoryData = categoryDoc?.exists() ? (categoryDoc.data() as Category) : null;

            return {
                id: docSnapshot.id,
                name,
                description,
                initDate,
                initVideo,
                endDate,
                isCause,
                isExperience,
                isFinished,
                cumulativeAmount,
                requestAmount,
                donorsCount,
                multimedia,
                foundation: foundationData ? { ...foundationData, id: foundationDoc.id } : null,
                responsible: userData,
                category: categoryData,
                createdAt: createdAt,
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
            ...(limit > 0 ? [firestoreLimit(limit)] : []) // Apply limit if specified
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
            firestoreLimit(100)
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
 * Adds a new campaign to the database, including multimedia upload and user reference association.
 * @param {Campaign} data - An object containing the campaign data to add.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
 */
export const addCampaign = async (data: Campaign, user: string): Promise<{ success: boolean }> => {
    try {
        const {
            name,
            description,
            initVideo,
            isCause,
            isExperience,
            requestAmount,
            foundation,
            category,
            responsible,
            createdBy
        } = data;

        // Convert various IDs to Firestore references
        const foundationRef = foundation ? doc(FirebaseDB, 'foundations', foundation as string) : null;
        const categoryRef = category ? doc(FirebaseDB, 'categories', category as string) : null;
        const responsibleRef = responsible ? doc(FirebaseDB, 'users', responsible as string) : null;
        const createdByRef = createdBy ? doc(FirebaseDB, 'users', createdBy as string) : null;

        const foundationDoc = await getDoc(foundationRef);

        if (!foundationDoc.exists()) {
            console.error("La fundación especificada no existe.");
            return { success: false };
        }

        //Extract foundation Info
        const foundationData = foundationDoc.data() as Foundation;
        const { confidenceLevel } = foundationDoc.data() as Foundation;

        const newCampaignData: Partial<Campaign> = {
            name,
            description,
            initVideo,
            initDate: Timestamp.now(),
            endDate: addTwoMonths(Timestamp.now()),
            isCause,
            isExperience,
            requestAmount,
            cumulativeAmount: 0,
            foundation: foundationRef,
            category: categoryRef,
            responsible: responsibleRef,
            status: (user === "Admin") ? true : ((confidenceLevel === 1) ? false : true),
            delete: false,
            donorsCount: 0,
            isFinished: false,
            isExecute: false,
            createdAt: Timestamp.now(),
            createdBy: createdByRef,
        };

        const campaignRef = await addDoc(collection(FirebaseDB, "campaigns"), newCampaignData);

        if (campaignRef.id) {
            let currentCampaigns: string[] = foundationData.campaigns;

            if (!Array.isArray(currentCampaigns)) {
                console.warn("La propiedad 'campaigns' no es un arreglo. Inicializando como arreglo vacío.");
                currentCampaigns = [];
            }

            currentCampaigns.push(campaignRef.id);

            await updateDoc(foundationRef, {
                campaigns: currentCampaigns
            });

            return { success: true };
        }
        return { success: false };
    } catch (error) {
        console.error("Error adding campaign: ", error);
        return { success: false };
    }
};


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
export const approveCampaign = async (campaignId: string): Promise<{ success: boolean }> => {
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
 * Deleted a campaign by updating its status to false.
 * @param {string} campaignId - The ID of the campaign to delete.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
 */
export const deleteCampaign = async (campaignId: string): Promise<{ success: boolean }> => {
    try {
        const campaignRef = doc(FirebaseDB, "campaigns", campaignId);
        await updateDoc(campaignRef, { status: false });
        return { success: true };
    } catch (error) {
        console.error("Error deleting campaign:", error);
        return { success: false };
    }
};

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

        // Filter out any null value campaigns array
        return campaigns.filter(campaign => campaign !== null);

    } catch (error) {
        // console.error("Error getting documents: ", error);
        return []
    }
}
