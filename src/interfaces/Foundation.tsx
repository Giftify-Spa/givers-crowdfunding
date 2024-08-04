import { GeoPoint } from "firebase/firestore";

export interface Foundation {
    name: string;
    fono: string;
    confidenceLevel: number;
    country: string;
    city: string;
    address: string;
    lat?: string;
    lng?: string;
    location?: GeoPoint;
    status?: boolean;
    responsible: string;
}