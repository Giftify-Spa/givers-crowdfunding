/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentReference, Timestamp } from "firebase/firestore"
/**
 * @interface Campaign
 * @property {string} [id] - The unique identifier of the campaign.
 * @property {string} name - The name of the campaign.
 * @property {string} description - A brief description of the campaign.
 * @property {string} initVideo - The initial video URL for the campaign.
 * @property {string} [endVideo] - The ending video URL for the campaign.
 * @property {Timestamp | Date | string} [initDate] - The start date of the campaign.
 * @property {Timestamp | Date | string} [endDate] - The end date of the campaign.
 * @property {boolean} isCause - Indicates if the campaign is for a cause.
 * @property {boolean} isExperience - Indicates if the campaign is for an experience.
 * @property {boolean} [isFinished] - Indicates if the campaign is finished.
 * @property {boolean} [isExecute] - Indicates if the campaign is being executed.
 * @property {number} [cumulativeAmount] - The cumulative amount raised by the campaign.
 * @property {number} requestAmount - The amount requested for the campaign.
 * @property {boolean} [status] - The status of the campaign (true = enabled, false = disabled).
 * @property {boolean} [delete] - Indicates if the campaign is marked for deletion.
 * @property {number} [donorsCount] - The number of donors for the campaign.
 * @property {Timestamp | null} [createdAt] - The timestamp when the campaign was created.
 * @property {DocumentReference | string | any} [category] - The category of the campaign.
 * @property {any} [foundation] - The foundation associated with the campaign.
 * @property {DocumentReference | string | any} [responsible] - The responsible entity for the campaign.
 * @property {any} [createdBy] - The entity that created the campaign.
 */
export interface Campaign {
    id?: string;
    name: string;
    description: string;
    initVideo: string;
    endVideo?: string;
    initDate?: Timestamp | Date | string;
    endDate?: Timestamp | Date | string;
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