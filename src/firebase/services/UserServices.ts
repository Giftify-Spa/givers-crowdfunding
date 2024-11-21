/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts
import { User } from "../../interfaces/User";
import { FirebaseDB } from "../config";
import {
    collection,
    query,
    getDocs,
    where,
    limit as firestorelimit,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    orderBy,
    startAfter,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { Campaign } from "../../interfaces/Campaign";

export const countUsers = async (): Promise<number> => {
    try {

        // Referencia a la colección 'users'
        const usersCollectionRef = collection(FirebaseDB, 'users');

        // Obtener todos los documentos de la colección 'users'
        const usersSnapshot = await getDocs(usersCollectionRef);

        // Retornar la cantidad de documentos en la colección
        return usersSnapshot.size;
    } catch (error) {
        console.error("Error al contar los usuarios:", error);
        throw new Error("No se pudo contar los usuarios");
    }
};

export const getUserByUid = async (uid: string): Promise<User | null> => {
    try {
        const usersCollection = collection(FirebaseDB, 'users');
        const q = query(usersCollection, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Assuming uid is unique and there's only one document
            return {
                ...userDoc.data() as User,
                id: userDoc.id
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user by UID:', error);
        return null;
    }
};

export const getUserReferenceByUid = async (uid: string): Promise<any> => {
    try {
        const usersCollection = collection(FirebaseDB, 'users');
        const q = query(usersCollection, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].id; // Assuming uid is unique and there's only one document
            return userDoc;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user by UID:', error);
        return null;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        // Reference to the "users" collection in Firestore
        const usersCollectionRef = collection(FirebaseDB, "users");

        // Create a query that searches by "email" field and limits results to 1 document
        const q = query(usersCollectionRef, where("email", "==", email), firestorelimit(1));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // If a document is found, return the data of the first document (since only 1 is expected)
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0] // Efficient: returns only the first match
        }

        // If no document matches the email, return null
        return null;

    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error; // Handle or rethrow the error
    }
}

export const getUsersSelect = async () => {
    try {
        const q = query(collection(FirebaseDB, "users"),
            where("profile", "!=", 'Admin'));

        const querySnapshot = await getDocs(q);

        const users = [];
        querySnapshot.forEach((doc) => {
            const { name, email, profile } = doc.data();
            users.push({
                id: doc.id,
                name,
                email,
                profile
            });
        });

        return users;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

const getAuthenticatedUserId = async (): Promise<string | null> => {
    const auth = getAuth();
    const userAuth = auth.currentUser;

    const userId = getUserReferenceByUid(userAuth.uid);

    return userId ? userId : null;
};

/**
 * Retrieves the list of contributions made by the authenticated user.
 * @returns {Promise<Array>} An array of contribution objects containing details of each contribution and its related campaign.
 */
export const getDonorsByUser = async (): Promise<Array<any>> => {
    try {
        // Get the authenticated user's ID
        const userId = await getAuthenticatedUserId();
        if (!userId) {
            throw new Error("No authenticated user found");
        }

        // Reference the user's document in the 'users' collection
        const userRef = doc(FirebaseDB, 'users', userId);
        const userDoc = await getDoc(userRef);
        const user = userDoc.data();



        // Fetch all contributions in parallel using Promise.all
        const contributionsPromises = user.contributions.map((contributionId: string) => {
            const contributionRef = doc(FirebaseDB, "contributions", contributionId);
            return getDoc(contributionRef);
        });

        // Wait for all contribution documents to be fetched
        const contributionsDocs = await Promise.all(contributionsPromises);

        // Map the fetched contributions to the required format
        const contributions = await Promise.all(contributionsDocs.map(async (contributionDoc) => {
            if (!contributionDoc.exists()) {
                console.warn(`Contribution not found: ${contributionDoc.id}`);
                return null; // O Return null or handle is another way as needed
            }

            // Extract contribution data
            const { contributionAmount, userContribution, dateContribution, state, campaign } = contributionDoc.data();

            // If campaign reference is valid, fetch the campaign data
            let campaignData = null;
            if (campaign) {
                const campaignDoc = await getDoc(campaign);
                campaignData = campaignDoc.exists() ? (campaignDoc.data() as Campaign) : null;
            }

            return {
                id: contributionDoc.id,
                contributionAmount,
                dateContribution,
                state,
                userContribution,
                campaign: {
                    id: campaign?.id,
                    name: campaignData?.name,
                },
            };
        }));

        // Filter out any null values from the contributions array
        return contributions.filter(contribution => contribution !== null);

    } catch (error) {
        return []
    }
}


export async function checkUser(data: User) {
    // Verificar si el usuario existe. Si existe -> flujo normal : No existe -> crear usuario

    // Flujo normal: Obtengo referencia y la envio como un campo para crear la orden ....

    // No existe: crear el usuario con la informacion que ingreso en el formul...

    try {
        const userExists = await getUserByEmail(data.email);

        if (userExists) {
            return userExists.id;
        }

        // Create user in db
        const docRef = await addDoc(collection(FirebaseDB, 'users'), {
            name: data.name,
            lastname: data.lastname,
            email: data.email
        });

        return docRef.id;

    } catch (error) {
        console.log(error);
    }
}

/**
 * Disables a user by updating their status in Firestore.
 * @param {string} userId - The ID of the user to disable.
 * @returns {Promise<void>} - A promise that resolves when the user is successfully disabled.
 * @throws {Error} - If there is an issue updating the user status.
 */
export const disableUser = async (userId: string): Promise<void> => {
    try {
        // Reference the specific user's document in Firestore
        const userRef = doc(FirebaseDB, 'users', userId);

        // Update the user's status to disabled (e.g., set "status" to false or "status" to "disabled")
        await updateDoc(userRef, {
            status: false, // Adjust this field to match your data structure (e.g., use "status: 'disabled'" if applicable)
        });

        console.log(`User with ID ${userId} has been disabled.`);
    } catch (error) {
        console.error("Error disabling user:", error);
        throw new Error("Unable to disable the user. Please try again later.");
    }
};

/**
 * Toggles a user's status (enables or disables) by updating their status in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {boolean} status - The desired status for the user (true to enable, false to disable).
 * @returns {Promise<void>} - A promise that resolves when the user's status is updated.
 * @throws {Error} - If there is an issue updating the user status.
 */
export const toggleUserStatus = async (userId: string, status: boolean): Promise<void> => {
    try {
        // Reference the specific user's document in Firestore
        const userRef = doc(FirebaseDB, 'users', userId);

        // Update the user's status in Firestore
        await updateDoc(userRef, {
            status: status,
        });

        console.log(`User with ID ${userId} has been ${status ? 'enabled' : 'disabled'}.`);
    } catch (error) {
        console.error(`Error ${status ? 'enabling' : 'disabling'} user:`, error);
        throw new Error(`Unable to ${status ? 'enable' : 'disable'} the user. Please try again later.`);
    }
};

/**
 * Fetches a paginated list of users from Firestore.
 * @param {number} pageSize - The number of users per page.
 * @param {any} lastDoc - The last document from the previous page (for pagination).
 * @returns {Promise<{ users: User[], lastDoc: any }>} A promise that resolves to an object containing the array of user objects and the last document.
 */
export const getPaginatedUsers = async (limit: number, lastDoc: any = null): Promise<{ users: User[], lastDoc: any }> => {
    try {
        // Construye la consulta Firestore con filtros y paginación
        let baseQuery = query(
            collection(FirebaseDB, "users"),
            orderBy("name"), // Ordena por nombre para paginación
            ...(limit > 0 ? [firestorelimit(limit)] : []) // Apply limit if specified
        );

        // Si lastDoc existe, agrégalo a la consulta
        if (lastDoc) {
            baseQuery = query(baseQuery, startAfter(lastDoc));
        }

        // Ejecuta la consulta y obtiene los documentos
        const querySnapshot = await getDocs(baseQuery);

        // Mapea cada documento a un objeto User
        const users: User[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as User));

        // Retorna los usuarios y el último documento para paginación
        return {
            users,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        };
    } catch (error) {
        console.error("Error fetching paginated users:", error);
        return { users: [], lastDoc: null };
    }
};