import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { FirebaseDB } from "../../config";
import { Campaign } from "../../../interfaces/Campaign";
import { Foundation } from "../../../interfaces/Foundation";
import { addTwoMonths } from "../../../helpers/addTwoMonths";


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