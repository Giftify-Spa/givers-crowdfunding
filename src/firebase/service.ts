/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseDB, FirebaseStorage } from "./config";
import {
  collection,
  doc,
  addDoc,
  query,
  getDocs,
  where,
  getDoc,
} from "firebase/firestore";

import axios from 'axios';
import { Contribution } from "../interfaces/Contribution";



export const addDocument = async (collectionName: string, data: any) => {
  try {
    await addDoc(collection(FirebaseDB, collectionName), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};



export const checkIfDocumentExists = async (
  collectionName: string,
  fieldName: string,
  value: string
): Promise<boolean> => {
  const q = query(collection(FirebaseDB, collectionName), where(fieldName, '==', value));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

/**
 * Function to check if a document exists in a Firestore collection by its ID.
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} documentId - ID of the document to check
 * @returns {Promise<object | null>} - Returns the document data if found, or null if not
 */
export const checkDocumentById = async (collectionName: string, documentId: string): Promise<object | null> => {
  try {
    // Get a reference to the specific document by its ID
    const docRef = doc(FirebaseDB, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      return docSnap.data(); // Return document data if found
    } else {
      console.log("No such document!");
      return null; // Return null if document doesn't exist
    }
  } catch (error) {
    console.error("Error checking document:", error);
    return null; // Throw error for further handling if needed
  }
};

// Create Operations
export const addOrder = async (data: Contribution) => {
  try {
    const {
      contributionAmount,
      os,
      status,
      userId,
      campaignId
    } = data;

    // Convert user ID to a Firestore reference
    const userRef = doc(FirebaseDB, 'users', userId);

    // Convert campaign ID to a Firestore reference
    const campaignRef = doc(FirebaseDB, 'campaigns', campaignId)

    const dateContribution = new Date();

    const docRef = await addDoc(collection(FirebaseDB, 'contributions'), {
      contributionAmount,
      os,
      status,
      dateContribution,
      user: userRef,
      campaign: campaignRef
    });

    return {
      success: true,
      order: {
        id: docRef.id,
        contributionAmount,
        os,
        status,
        dateContribution,
        userId
      }
    };
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(FirebaseStorage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

export async function webpayCreateOrder() {
  const response = await axios.post(`${import.meta.env.VITE_API_URL_TRANSBANK_CREATE}`, { amount: 69000 }, {
    headers: {
      orderId: "J2tb5o55z4E1TmfjpwFF",
      amount: 69000,
      status: "INITIALIZED",
      os: "ANDROID"
    }
  })

  return response;
}

export async function webpayResponse(data: any) {


  const respuesta = await fetch(`${import.meta.env.VITE_API_URL_LOCAL}webpay-response`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' }
  })
  return respuesta.json()

}


export async function getBanks() {
  const url = `/api/institutions?country=cl&type=bank`;
  const apiKey = import.meta.env.VITE_API_FINTOC_KEY;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}