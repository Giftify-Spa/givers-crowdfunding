/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentReference, GeoPoint } from "firebase/firestore";

export interface Foundation {
    id?: string;
    name: string;
    description: string;
    fono: string;
    confidenceLevel: number; // Low = 1, Medium = 2, High = 3
    country: string;
    city: string;
    address: string;
    lat?: string;
    lng?: string;
    location?: GeoPoint;
    status?: boolean;
    responsible?: DocumentReference | string;
    image?: string;
    fundsTransferData?: FundsTransferData;
    multimedia?: any[];
    campaigns?: string[];
}
interface FundsTransferData {
    accountNumber: string;
    accountType: string;
    bank: string;
    email: string;
    holderName: string;
}