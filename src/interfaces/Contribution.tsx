/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";

/**
 * @interface Contribution
 * @property {any} [card] - The card used for the contribution.
 * @property {number} contributionAmount - The amount of the contribution.
 * @property {any} [campaign] - The campaign associated with the contribution.
 * @property {Timestamp} [dateContribution] - The date of the contribution.
 * @property {string} os - The operating system used for the contribution.
 * @property {string} [payment_method] - The payment method used for the contribution.
 * @property {boolean} [pending] - Indicates if the contribution is pending.
 * @property {string} status - The status of the contribution.
 * @property {any} [tbk_response] - The
 * @property {string} [token_ws] - The token of the contribution.
 * @property {string} [url_pago] - The payment URL of the contribution.
 * @property {any} [user] - The user who made the contribution.
 * @property {string} [userId] - The ID of the user who made the contribution.
 * @property {string} [campaignId] - The ID of the campaign associated with the contribution.
 */
export interface Contribution {
    card?: any;
    contributionAmount: number;
    campaign?: any;
    dateContribution?: Timestamp;
    os: string;
    payment_method?: string;
    pending?: boolean;
    status: string;
    tbk_response?: any;
    token_ws?: string;
    url_pago?: string;
    user?: any;
    userId?: string;
    campaignId?: string;
}