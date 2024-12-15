/* eslint-disable @typescript-eslint/no-explicit-any */
import {User} from "../../../interfaces/User";
import { Foundation } from "../../../interfaces/Foundation";
import { Category } from "../../../interfaces/Category";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { FirebaseDB } from "../../config";


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
                responsible: {...userData, id: userDoc.id},
                category: { ...categoryData, id: categoryDoc.id },
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