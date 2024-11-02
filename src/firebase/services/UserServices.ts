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
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { Campaign } from "../../interfaces/Campaign";


// Get Operations

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
export const getDonorsByUser = async () => {
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
        console.error("Error getting documents: ", error);
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