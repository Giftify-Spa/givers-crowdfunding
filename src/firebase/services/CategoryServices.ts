/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts
import { FirebaseDB } from "../config";
import {
    collection,
    query,
    getDocs
} from "firebase/firestore";

export const getCategories = async () => {
    try {
        const q = query(collection(FirebaseDB, "categories"));

        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {

            const { name, icon } = doc.data();
            categories.push({
                id: doc.id,
                name,
                icon
            });
        });

        return categories;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

export const getCategoriesSelect = async () => {
    try {
        const q = query(collection(FirebaseDB, "categories"));

        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {

            const { name } = doc.data();
            categories.push({
                id: doc.id,
                name
                // ...doc.data(),
            });
        });
        return categories;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}