/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";

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