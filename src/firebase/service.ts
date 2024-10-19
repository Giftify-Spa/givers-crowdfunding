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
  GeoPoint,
  limit as firestorelimit,
  Query,
  DocumentData,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";

import axios from 'axios';
import { Category } from "../interfaces/Category";
import { Contribution } from "../interfaces/Contribution";
import { getAuth } from "firebase/auth";

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

export const getFoundation = async (id: string) => {
  try {
    const docRef = doc(FirebaseDB, "foundations", id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const {
        name,
        description,
        fono,
        country,
        image,
        status,
        responsible,
        confidenceLevel,
        city,
        address
      } = docSnapshot.data();

      return {
        id: docSnapshot.id,
        name,
        description,
        fono,
        country,
        image,
        status,
        responsible,
        confidenceLevel,
        city,
        address
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

export const getFoundations = async () => {
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
        image
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
        responsibleName: responsibleData.name,
        responsibleEmail: responsibleData.email,
        image
      };
    });

    const foundations = await Promise.all(foundationPromises);
    return foundations;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

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
