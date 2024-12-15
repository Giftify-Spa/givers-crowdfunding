/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentReference, GeoPoint } from "firebase/firestore";

/**
 * @interface FoundationInput
 * @property {string} [id] - The unique identifier of the foundation.
 * @property {string} name - The name of the foundation.
 * @property {string} description - A brief description of the foundation.
 * @property {string} fono - The phone number of the foundation.
 * @property {number} confidenceLevel - The confidence level of the foundation (Low = 1, Medium = 2, High = 3).
 * @property {string} [country] - The country where the foundation is located.
 * @property {string} city - The city where the foundation is located.
 * @property {string} address - The address of the foundation.
 * @property {string} [lat] - The latitude of the foundation.
 * @property {string} [lng] - The longitude of the foundation.
 * @property {GeoPoint} [location] - The location of the foundation.
 * @property {boolean} [status] - The status of the foundation (true = enabled, false = disabled).
 * @property {DocumentReference | string | any} [responsible] - The responsible entity for the foundation.
 * @property {string} [image] - The image URL of the foundation.
 * @property {FundsTransferData} [fundsTransferData] - The funds transfer data of the foundation.
 * @property {any[]} [multimedia] - The multimedia content of the foundation.
 * @property {string[]} [campaigns] - The campaigns associated with the foundation.
 */
export interface FoundationInput {
    id?: string;
    name: string;
    description: string;
    fono: string;
    confidenceLevel: number; // Low = 1, Medium = 2, High = 3
    country?: string;
    city: string;
    address: string;
    lat?: string;
    lng?: string;
    location?: GeoPoint;
    status?: boolean;
    responsible?: DocumentReference | string | any;
    image?: string;
    fundsTransferData?: FundsTransferData;
    multimedia?: any[];
    campaigns?: string[];
}

/**
 * @interface FundsTransferData
 * @property {string} accountNumber - The account number of the foundation.
 * @property {string} accountType - The account type of the foundation.
 * @property {string} bank - The bank of the foundation.
 * @property {string} email - The email of the foundation.
 * @property {string} holderName - The holder name of the foundation.
 */
interface FundsTransferData {
    accountNumber: string;
    accountType: string;
    bank: string;
    email: string;
    holderName: string;
}