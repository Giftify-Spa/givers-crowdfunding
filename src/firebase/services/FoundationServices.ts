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
    deleteField,
    limit as firestorelimit,
    orderBy,
    startAfter,
} from "firebase/firestore";
import { uploadFile } from "../service";
import { FoundationInput } from '../../interfaces/FoundationInput';

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

            // Obtain Responsible
            const responsibleDoc = await getDoc(responsible);
            const responsibleData = responsibleDoc.exists() ? responsibleDoc.data() as User : null;

            return {
                id: docSnapshot.id,
                name,
                description,
                fono,
                country,
                status,
                responsible: { id: responsibleDoc.id, ...responsibleData },
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
export const addFoundation = async (data: FoundationInput): Promise<IFoundationResponse> => {
    try {

        const { name, description, fono, lat, lng, country, city, address, confidenceLevel, responsible, multimedia } = data;

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
            description,
            fono,
            country,
            city,
            address,
            confidenceLevel,
            location: geoPoint,
            lat: latitude,
            lng: longitude,
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
 * Edits an existing foundation document in Firestore with the provided foundation details.
 * @param {string} id - The ID of the foundation to edit.
 * @param {Foundation} data - An object containing the foundation details to be updated.
 * @returns {Promise<IFoundationResponse>} An object indicating success if the foundation was updated successfully.
 */
export const editFoundation = async (id: string, data: FoundationInput): Promise<IFoundationResponse> => {
    try {
        const {
            name,
            description,
            fono,
            country,
            city,
            address,
            confidenceLevel,
            responsible,
            // multimedia
        } = data;

        // Parse latitude and longitude to numbers
        // const latitude = parseFloat(lat);
        // const longitude = parseFloat(lng);

        // Create a GeoPoint for the location
        // const geoPoint = new GeoPoint(latitude, longitude);

        // Reference to the existing foundation document
        const foundationRef = doc(FirebaseDB, 'foundations', id);
        const foundationSnap = await getDoc(foundationRef);

        if (!foundationSnap.exists()) {
            console.error("Foundation does not exist");
            return { success: false, message: "Foundation does not exist" };
        }

        const existingFoundation = foundationSnap.data() as Foundation;

        // Determine if the responsible user has changed
        const oldResponsibleId = existingFoundation.responsible?.id || null;
        const newResponsibleId = responsible || null;

        if (oldResponsibleId !== newResponsibleId) {
            if (oldResponsibleId) {
                // Remove the foundation reference from the old responsible user
                await updateDoc(doc(FirebaseDB, 'users', oldResponsibleId), {
                    foundation: deleteField()
                });
            }

            if (newResponsibleId) {
                // Set the foundation reference in the new responsible user
                await updateDoc(doc(FirebaseDB, 'users', newResponsibleId), {
                    foundation: doc(FirebaseDB, 'foundations', id)
                });
            }
        }

        // Handle multimedia files
        // let uploadedFiles: string[] = [];

        // if (multimedia && multimedia.length > 0) {
        //     // Optional: Delete old multimedia files from Storage
        //     if (existingFoundation.multimedia && existingFoundation.multimedia.length > 0) {
        //         await Promise.all(existingFoundation.multimedia.map(url => deleteFile(url)));
        //     }

        //     // Upload new multimedia files
        //     uploadedFiles = await Promise.all(multimedia.map(file => uploadFile(file, `foundations/${name}/${file.name}`)));
        // } else {
        //     // If no new files are provided, retain existing multimedia
        //     uploadedFiles = existingFoundation.multimedia || [];
        // }

        // Create a reference to the responsible user if defined
        const responsibleRef = newResponsibleId ? doc(FirebaseDB, 'users', newResponsibleId) : null;

        // Prepare the updated foundation data
        const updatedFoundationData: Partial<Foundation> = {
            name,
            description,
            fono,
            country,
            city,
            address,
            confidenceLevel,
            // location: geoPoint,
            // lat: latitude,
            // lng: longitude,
            responsible: responsibleRef,
            // multimedia: uploadedFiles,
            // Add other fields if necessary
        };

        // Update the foundation document in Firestore
        await updateDoc(foundationRef, updatedFoundationData);

        return { success: true };
    } catch (e) {
        console.error("Error editing foundation: ", e);
        return { success: false, message: "Error editing foundation" };
    }
}

/**
 * Deleted a foundation by updating its status to false.
 * @param {string} foundationId - The ID of the foundation to delete.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
 */
export const deleteFoundation = async (foundationId: string): Promise<{ success: boolean }> => {
    try {
        const foundationRef = doc(FirebaseDB, "foundations", foundationId);
        await updateDoc(foundationRef, { status: false });
        return { success: true };
    } catch (error) {
        console.error("Error deleting foundation:", error);
        return { success: false };
    }
};

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

/**
 * Fetches a paginated list of users from Firestore.
 * @param {number} pageSize - The number of users per page.
 * @param {any} lastDoc - The last document from the previous page (for pagination).
 * @returns {Promise<{ foundations: Foundation[], lastDoc: any }>} A promise that resolves to an object containing the array of user objects and the last document.
 */
export const getPaginatedFoundations = async (limit: number, lastDoc: any = null): Promise<{ foundations: Foundation[], lastDoc: any }> => {
    try {
        // Construye la consulta Firestore con filtros y paginación
        let baseQuery = query(
            collection(FirebaseDB, "foundations"),
            orderBy("name"), // Ordena por nombre para paginación
            ...(limit > 0 ? [firestorelimit(limit)] : []) // Apply limit if specified
        );

        // Si lastDoc existe, agrégalo a la consulta
        if (lastDoc) {
            baseQuery = query(baseQuery, startAfter(lastDoc));
        }

        // Ejecuta la consulta y obtiene los documentos
        const querySnapshot = await getDocs(baseQuery);

        const foundationPromises = querySnapshot.docs.map(async (doc) => {
            const {
                name,
                description,
                confidenceLevel,
                country,
                city,
                address,
                fono,
                responsible,
                image,
                fundsTransferData,
                status
            } = doc.data() as Foundation;

            // Obtain Responsible
            const responsibleDoc = await getDoc(responsible);
            const responsibleData = responsibleDoc.exists() ? responsibleDoc.data() as User : null;

            return {
                id: doc.id,
                name,
                description,
                confidenceLevel,
                country,
                city,
                address,
                fono,
                responsible: { id: responsibleDoc.id, ...responsibleData },
                image,
                fundsTransferData,
                status
            };
        });

        const foundations = await Promise.all(foundationPromises);

        return {
            foundations,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        };
    } catch (error) {
        console.error("Error fetching paginated users:", error);
        return { foundations: [], lastDoc: null };
    }
};

/**
 * Toggles a foundation's status (enables or disables) by updating their status in Firestore.
 * @param {string} foundationId - The ID of the foundation.
 * @param {boolean} status - The desired status for the foundation (true to enable, false to disable).
 * @returns {Promise<void>} - A promise that resolves when the foundation's status is updated.
 * @throws {Error} - If there is an issue updating the foundation status.
 */
export const toggleFoundationStatus = async (foundationId: string, status: boolean): Promise<void> => {
    try {
        // Reference the specific foundation's document in Firestore
        const foundationRef = doc(FirebaseDB, 'foundations', foundationId);

        // Update the foundation's status in Firestore
        await updateDoc(foundationRef, {
            status: status,
        });
    } catch (error) {
        console.error(`Error ${status ? 'enabling' : 'disabling'} foundation:`, error);
        throw new Error(`Unable to ${status ? 'enable' : 'disable'} the foundation. Please try again later.`);
    }
};