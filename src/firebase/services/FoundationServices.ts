/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts
import { Foundation } from "../../interfaces/Foundation";
import { User } from "../../interfaces/User";
import { IFoundationResponse } from "../../types";
import { FirebaseDB } from "../config";
import {
    collection,
    query,
    getDocs,
    where,
    getDoc,
    doc,
    GeoPoint,
    addDoc,
    updateDoc,
} from "firebase/firestore";
import { uploadFile } from "../service";

export const countFoundations = async (): Promise<number> => {
    try {

        // Referencia a la colección 'foundations'
        const foundationsCollectionRef = collection(FirebaseDB, 'foundations');

        // Obtener todos los documentos de la colección 'foundations'
        const foundationsSnapshot = await getDocs(foundationsCollectionRef);

        // Retornar la cantidad de documentos en la colección
        return foundationsSnapshot.size;
    } catch (error) {
        console.error("Error al contar las fundaciones:", error);
        throw new Error("No se pudo contar las fundaciones");
    }
};

/**
 * Retrieves the details of a specific foundation by its ID.
 * @param {string} id - The unique identifier of the foundation.
 * @returns {Promise<Object|null>} An object containing foundation details if found, otherwise null.
 */
export const getFoundation = async (id: string): Promise<Foundation | null> => {
    try {
        const docRef = doc(FirebaseDB, "foundations", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const {
                name,
                description,
                fono,
                country,
                status,
                responsible,
                confidenceLevel,
                city,
                address,
                fundsTransferData,
                multimedia
            } = docSnapshot.data();

            return {
                id: docSnapshot.id,
                name,
                description,
                fono,
                country,
                status,
                responsible,
                confidenceLevel,
                city,
                address,
                fundsTransferData,
                multimedia
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

/**
 * Retrieves the list of active foundations with responsible user details.
 * @returns {Promise<Array>} An array of foundation objects containing basic details and responsible user information.
 */
export const getFoundations = async (): Promise<Array<any>> => {
    try {
        const q = query(collection(FirebaseDB, "foundations"),
            where("status", "==", true));

        const querySnapshot = await getDocs(q);

        const foundationPromises = querySnapshot.docs.map(async (doc) => {
            const {
                name,
                country,
                city,
                address,
                fono,
                responsible,
                image,
                fundsTransferData
            } = doc.data();

            // Obtain Responsible
            const responsibleDoc = await getDoc(responsible);
            const responsibleData = responsibleDoc.exists() ? responsibleDoc.data() as User : null;

            return {
                id: doc.id,
                name,
                country,
                city,
                address,
                fono,
                responsibleName: responsibleData?.name,
                responsibleEmail: responsibleData?.email,
                image,
                fundsTransferData
            };
        });

        const foundations = await Promise.all(foundationPromises);
        return foundations;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
}

/**
 * Retrieves a list of active foundations in a simplified format for selection purposes.
 * @returns {Promise<Array>} An array of foundation objects with only ID and name properties.
 */
export const getFoundationsSelect = async (): Promise<Array<any>> => {
    try {
        const q = query(collection(FirebaseDB, "foundations"),
            where("status", "==", true));

        const querySnapshot = await getDocs(q);

        const foundations = [];
        querySnapshot.forEach((doc) => {

            const { name } = doc.data();
            foundations.push({
                id: doc.id,
                name
            });
        });

        return foundations;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

/**
 * Adds a new foundation document to Firestore with the provided foundation details.
 * @param {Foundation} data - An object containing the foundation details to be added.
 * @returns {Promise<Object>} An object indicating success if the foundation was added successfully.
 */
export const addFoundation = async (data: Foundation): Promise<IFoundationResponse> => {
    try {

        const { name, fono, lat, lng, country, city, address, confidenceLevel, responsible, multimedia } = data;

        // Convert location to a GeoPoint
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        const geoPoint = new GeoPoint(latitude, longitude);

        // Convert responsible ID to a Firestore reference
        const responsibleRef = responsible ? doc(FirebaseDB, 'users', responsible as string) : null;

        // Upload multimedia files concurrently
        const uploadedFiles = multimedia && multimedia.length > 0
            ? await Promise.all(multimedia.map(file => uploadFile(file, `foundations/${name}/${file.name}`)))
            : [];

        const newFoundationData: Partial<Foundation> = {
            name,
            fono,
            country,
            city,
            address,
            confidenceLevel,
            location: geoPoint,
            status: true,
            responsible: responsibleRef,
            multimedia: uploadedFiles,
        };

        const foundationRef = await addDoc(collection(FirebaseDB, "foundations"), newFoundationData);

        const responsibleDoc = await getDoc(responsibleRef);

         // Perform the update in Firestore to responsible
         await updateDoc(doc(FirebaseDB, 'users', responsibleDoc.id), {
            foundation: foundationRef.id
        });

        if (foundationRef.id) {
            return { success: true };
        }
        return {
            success: true
        };
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

/**
 * Updates only the payment information of an existing foundation document.
 * @param {string} foundationId - The unique identifier of the foundation to be updated.
 * @param {Object} paymentData - An object containing payment details to update.
 * @param {string} paymentData.bank - The name of the bank associated with the foundation.
 * @param {string} paymentData.accountType - The type of bank account (e.g., checking or savings).
 * @param {string} paymentData.holderName - The name of the account holder.
 * @param {number} paymentData.accountNumber - The bank account number.
 * @param {string} paymentData.email - The email associated with the payment details.
 * @returns {Promise<Object>} An object indicating success or failure and any error encountered.
 */
export const updateFoundationPaymentInfo = async (foundationId: string, paymentData: {
    bank: string;
    accountType: string;
    // holderName: string;
    accountNumber: string;
    email: string;
}): Promise<IFoundationResponse> => {
    try {
        const { bank, accountType, accountNumber, email } = paymentData;

        // Create the payment information object to update
        const updateData = {
            bank,
            accountType,
            accountNumber,
            email
        };

        // Perform the update in Firestore
        await updateDoc(doc(FirebaseDB, 'foundations', foundationId), {
            fundsTransferData: updateData
        });

        return {
            success: true
        };
    } catch (e) {
        console.error("Error updating foundation payment info: ", e);
        return {
            success: false,
            error: e
        };
    }
};
