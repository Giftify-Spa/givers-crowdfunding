/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.ts

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Campaign } from '../interfaces/Campaign';
import { Foundation } from "../interfaces/Foundation";
import { User } from "../interfaces/User";
import { FirebaseDB, FirebaseStorage } from "./config";
import {
  collection,
  doc,
  addDoc,
  query,
  getDoc,
  getDocs,
  where,
  GeoPoint
} from "firebase/firestore";

import axios from 'axios';
import { Category } from "../interfaces/Category";

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


// Get Operations
export const getUserByUid = async (uid: string): Promise<User | null> => {
  try {
    const usersCollection = collection(FirebaseDB, 'users');
    const q = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Assuming uid is unique and there's only one document
      return userDoc.data() as User;
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
      const userDoc = querySnapshot.docs[0]; // Assuming uid is unique and there's only one document
      return userDoc;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by UID:', error);
    return null;
  }
};

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

export const getDonorsByUser = async () => {
  try {
    const q = query(collection(FirebaseDB, "contributions"));

    const querySnapshot = await getDocs(q);

    const contributions = [];
    for (const doc of querySnapshot.docs) {
      const { contributionAmount, userContribution, dateContribution, state, campaign } = doc.data();

      // Obtain Campaign Data
      const campaignDoc = await getDoc(campaign);
      const campaignData = campaignDoc.exists() ? campaignDoc.data() as Campaign : null;

      contributions.push({
        id: doc.id,
        contributionAmount,
        dateContribution,
        state,
        userContribution,
        campaign: {
          id: campaignDoc.id,
          name: campaignData.name,
        }
      });
    }

    return contributions;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

export const getFoundations = async () => {
  try {
    const q = query(collection(FirebaseDB, "foundations"),
      where("status", "==", true));

    const querySnapshot = await getDocs(q);

    const foundations = [];

    for (const doc of querySnapshot.docs) {
      const { name, country, city, address, fono, responsible } = doc.data();

      // Obtain Responsible
      const responsibleDoc = await getDoc(responsible);
      const responsibleData = responsibleDoc.exists() ? responsibleDoc.data() as User : null;

      foundations.push({
        id: doc.id,
        name,
        country,
        city,
        address,
        fono,
        responsibleName: responsibleData.name,
        responsibleEmail: responsibleData.email
        // ...doc.data(),
      });
    }

    return foundations;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

export const getCampaigns = async () => {
  try {
    const q = query(collection(FirebaseDB, "campaigns"),
      where("status", "==", true));

    const querySnapshot = await getDocs(q);

    const campaigns = [];

    for (const doc of querySnapshot.docs) {
      const { name,
        description,
        initDate,
        endDate,
        isCause,
        isExperience,
        cumulativeAmount,
        requestAmount,
        donorsCount,
        multimedia,
        foundation,
        createdBy } = doc.data();

      // Obtain Foundation Data
      const foundationDoc = await getDoc(foundation);
      const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;

      // Obtain User Data
      const userDoc = await getDoc(createdBy);
      const userData = userDoc.exists() ? userDoc.data() as User : null;

      campaigns.push({
        id: doc.id,
        name,
        description,
        initDate,
        endDate,
        isCause,
        isExperience,
        cumulativeAmount,
        requestAmount,
        donorsCount,
        multimedia,
        foundation: foundationData,
        createdBy: userData
        // ...doc.data(),
      });
    }
    return campaigns;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

export const getCampaign = async (id: string) => {
  try {
    const docRef = doc(FirebaseDB, "campaigns", id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const { name,
        description,
        initDate,
        endDate,
        isCause,
        isExperience,
        cumulativeAmount,
        requestAmount,
        donorsCount,
        multimedia,
        foundation,
        category,
        responsible,
        createdAt } = docSnapshot.data();

      // Obtain Foundation Data
      const foundationDoc = await getDoc(foundation);
      const foundationData = foundationDoc.exists() ? foundationDoc.data() as Foundation : null;

      // Obtain User Data
      const userDoc = await getDoc(responsible);
      const userData = userDoc.exists() ? userDoc.data() as User : null;

      // Obtain Category Data
      const categoryDoc = await getDoc(category);
      const categoryData = categoryDoc.exists() ? categoryDoc.data() as Category : null;

      return {
        id: docSnapshot.id,
        name,
        description,
        initDate,
        endDate,
        isCause,
        isExperience,
        cumulativeAmount,
        requestAmount,
        donorsCount,
        multimedia,
        foundation: foundationData,
        responsible: userData,
        category: categoryData,
        createdAt
      };
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

export const getFoundationsSelect = async () => {
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
        // ...doc.data(),
      });
    });

    return foundations;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

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



// Create Operations
export const addFoundation = async (data: Foundation) => {
  try {

    const { name, fono, lat, lng, country, city, address, confidenceLevel, responsible } = data;

    // Convert location to a GeoPoint
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const geoPoint = new GeoPoint(latitude, longitude);

    // Convert responsible ID to a Firestore reference
    const userRef = doc(FirebaseDB, 'users', responsible);

    await addDoc(collection(FirebaseDB, 'foundations'), {
      name,
      fono,
      country,
      city,
      address,
      confidenceLevel,
      geoPoint,
      status: true,
      responsible: userRef
    });

    return {
      success: true
    };
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const addCampaign = async (data: Campaign) => {
  try {

    const { name,
      description,
      initDate,
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
    const createdByReference = doc(FirebaseDB, 'users', responseUser.id);


    // Upload multimedia files to Firebase Storage
    const uploadedFiles = await Promise.all(multimedia.map(async (file: File) => {
      const url = await uploadFile(file, `campaigns/${name}/${file.name}`);
      return url;
    }));


    await addDoc(collection(FirebaseDB, 'campaigns'), {
      name,
      description,
      initDate,
      endDate,
      isCause,
      isExperience,
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

