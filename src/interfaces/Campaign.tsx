/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentReference, Timestamp } from "firebase/firestore"

export interface Campaign {
    id?: string;
    name: string;
    description: string;
    initVideo: string;
    endVideo?: string;
    initDate: Timestamp | Date | string;
    endDate: Timestamp | Date | string;
    isCause: boolean;
    isExperience: boolean;
    isFinished?: boolean;
    isExecute?: boolean;
    cumulativeAmount?: number;
    requestAmount: number;
    status?: boolean;
    delete?: boolean;
    donorsCount?: number;
    createdAt?: Timestamp | null;
    category?: DocumentReference | string | any;
    foundation?: any;
    responsible?: DocumentReference | string | any;
    createdBy?: any;
}