/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts
import { Campaign } from "../../interfaces/Campaign";
import { Category } from "../../interfaces/Category";
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
    limit as firestorelimit,
    QueryDocumentSnapshot,
    DocumentData,
    Query,
    startAfter,
    addDoc,
    getCountFromServer
} from "firebase/firestore";
import { uploadFile } from "../service";
import { getUserReferenceByUid } from "./UserServices";




export const getCampaigns = async (limit: number) => {
    try {
        let q: any;
        if (limit > 0) {
            q = query(collection(FirebaseDB, "campaigns"), where("status", "==", true), firestorelimit(limit));
        } else {
            q = query(collection(FirebaseDB, "campaigns"), where("status", "==", true));

        }
        const querySnapshot = await getDocs(q);

        const campaignsPromises = querySnapshot.docs.map(async (doc) => {
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
                createdBy
            } = doc.data() as Campaign;

            // Obtener datos de Foundation y User en paralelo
            const [foundationDoc, userDoc] = await Promise.all([getDoc(foundation), getDoc(createdBy)]);

            const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;
            const userData = userDoc.exists() ? userDoc.data() as User : null;

            return {
                id: doc.id,
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
                foundation: foundationData,
                createdBy: userData
            };
        });

        const campaigns = await Promise.all(campaignsPromises);
        return campaigns;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
}

export const getCampaignsByType = async (type: 'cause' | 'experience', lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
    try {
        let q: Query<DocumentData, DocumentData>;

        if (type === 'cause') {
            q = query(
                collection(FirebaseDB, "campaigns"),
                where("status", "==", true),
                where("isCause", "==", true),
                ...(lastDoc ? [startAfter(lastDoc)] : []),
                firestorelimit(100),
            );
        } else if (type === 'experience') {
            q = query(
                collection(FirebaseDB, "campaigns"),
                where("status", "==", true),
                where("isExperience", "==", true),
                ...(lastDoc ? [startAfter(lastDoc)] : []),
                firestorelimit(100),
            );
        }

        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        const campaignsPromises = querySnapshot.docs.map(async (doc) => {
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
                createdBy
            } = doc.data() as Campaign;

            const [foundationDoc, userDoc] = await Promise.all([getDoc(foundation), getDoc(createdBy)]);

            const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;
            const userData = userDoc.exists() ? userDoc.data() as User : null;

            return {
                id: doc.id,
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
                foundation: foundationData,
                createdBy: userData
            };
        });

        const campaigns = await Promise.all(campaignsPromises);
        return { campaigns, lastVisible };
    } catch (error) {
        console.error("Error getting documents: ", error);
        return { campaigns: [], lastVisible: null };
    }
};

export const getCampaignsWithExperiences = async (limit: number) => {
    try {
        let q: any;
        if (limit > 0) {
            q = query(
                collection(FirebaseDB, "campaigns"),
                where("status", "==", true),
                where("isExperience", "==", true),
                firestorelimit(limit));
        } else {
            q = query(
                collection(FirebaseDB, "campaigns"),
                where("status", "==", true),
                where("isExperience", "==", true));

        }
        const querySnapshot = await getDocs(q);

        const campaignsPromises = querySnapshot.docs.map(async (doc) => {
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
                createdBy
            } = doc.data() as Campaign;

            // Obtener datos de Foundation y User en paralelo
            const [foundationDoc, userDoc] = await Promise.all([getDoc(foundation), getDoc(createdBy)]);

            const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;
            const userData = userDoc.exists() ? userDoc.data() as User : null;

            return {
                id: doc.id,
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
                foundation: foundationData,
                createdBy: userData
            };
        });

        const campaigns = await Promise.all(campaignsPromises);
        return campaigns;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
}

export const getCampaignsWithCauses = async (limit: number) => {
    try {
        let q: any;
        if (limit > 0) {
            q = query(
                collection(FirebaseDB, "campaigns"),
                where("status", "==", true),
                where("isCause", "==", true),
                firestorelimit(limit));
        } else {
            q = query(
                collection(FirebaseDB, "campaigns"),
                where("status", "==", true),
                where("isCause", "==", true));

        }
        const querySnapshot = await getDocs(q);

        const campaignsPromises = querySnapshot.docs.map(async (doc) => {
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
                createdBy
            } = doc.data() as Campaign;

            // Obtener datos de Foundation y User en paralelo
            const [foundationDoc, userDoc] = await Promise.all([getDoc(foundation), getDoc(createdBy)]);

            const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;
            const userData = userDoc.exists() ? userDoc.data() as User : null;

            return {
                id: doc.id,
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
                foundation: foundationData,
                createdBy: userData
            };
        });

        const campaigns = await Promise.all(campaignsPromises);
        return campaigns;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
}

export const getCampaign = async (id: string) => {
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
                createdAt
            } = docSnapshot.data();

            // Obtener datos de Foundation, User y Category en paralelo
            const [foundationDoc, userDoc, categoryDoc] = await Promise.all([
                getDoc(foundation),
                getDoc(responsible),
                getDoc(category)
            ]);


            const foundationId = foundationDoc.id;
            const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;
            const userData = userDoc.exists() ? userDoc.data() as User : null;
            const categoryData = categoryDoc.exists() ? categoryDoc.data() as Category : null;

            const totalFoundation = { ...foundationData, id: foundationId }

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
                foundation: totalFoundation,
                responsible: userData,
                category: categoryData,
                createdAt
            };
        } else {
            console.error("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        return null;
    }
}

export const getCampaignsWithFoundation = async (id: string) => {
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
                createdAt
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
                createdAt
            };
        }));

        // Filter out any null value campaigns array
        return campaigns.filter(campaign => campaign !== null);

    } catch (error) {
        console.error("Error getting documents: ", error);
        return []
    }
}

export const addCampaign = async (data: Campaign) => {
    try {
        const { name,
            description,
            initDate,
            initVideo,
            endDate,
            isCause,
            isExperience,
            requestAmount,
            multimedia,
            foundation,
            category,
            responsible,
            createdBy } = data;


        // Convert foundation ID to a Firestore reference
        const foundationRef = doc(FirebaseDB, 'foundations', foundation);

        // Convert category ID to a Firestore reference
        const categoryRef = doc(FirebaseDB, 'categories', category);

        // Convert responsible ID to a Firestore reference
        const responsibleRef = doc(FirebaseDB, 'users', responsible);

        const responseUser = await getUserReferenceByUid(createdBy);

        // Convert ID created campaign ID to a Firestore reference
        const createdByReference = doc(FirebaseDB, 'users', responseUser);

        // Upload multimedia files to Firebase Storage
        const uploadedFiles = await Promise.all(multimedia.map(async (file: File) => {
            const url = await uploadFile(file, `campaigns/${name}/${file.name}`);
            return url;
        }));

        await addDoc(collection(FirebaseDB, 'campaigns'), {
            name,
            description,
            initDate,
            initVideo,
            endDate,
            isCause,
            isExperience,
            isFinished: false,
            requestAmount,
            cumulativeAmount: 0,
            donorsCount: 0,
            status: true,
            multimedia: uploadedFiles,
            foundation: foundationRef,
            category: categoryRef,
            responsible: responsibleRef,
            createdAt: new Date(),
            createdBy: createdByReference
        });

        return {
            success: true
        };
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const countActiveCampaigns = async (): Promise<number> => {
    try {

        // Referencia a la colección 'campaigns'
        const campaignsCollectionRef = collection(FirebaseDB, 'campaigns');

        // Crear una consulta para campañas donde 'status' es true
        const activeCampaignsQuery = query(campaignsCollectionRef, where('isExecute', '==', false), where('isFinished', '==', false));

        // Obtener el conteo de documentos directamente desde el servidor sin traer todos los documentos
        const snapshot = await getCountFromServer(activeCampaignsQuery);

        // Retornar el conteo de documentos
        return snapshot.data().count;
    } catch (error) {
        console.error("Error al contar las campañas activas:", error);
        throw new Error("No se pudo contar las campañas");
    }
};

export const countFinishedCampaigns = async (): Promise<number> => {
    try {

        // Referencia a la colección 'campaigns'
        const campaignsCollectionRef = collection(FirebaseDB, 'campaigns');

        // Crear una consulta para campañas donde 'status' es true
        const activeCampaignsQuery = query(campaignsCollectionRef, where('isFinished', '==', true));

        // Obtener el conteo de documentos directamente desde el servidor sin traer todos los documentos
        const snapshot = await getCountFromServer(activeCampaignsQuery);

        // Retornar el conteo de documentos
        return snapshot.data().count;
    } catch (error) {
        console.error("Error al contar las campañas activas:", error);
        throw new Error("No se pudo contar las campañas");
    }
};