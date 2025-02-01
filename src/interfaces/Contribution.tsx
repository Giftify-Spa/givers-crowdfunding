import { Campaign } from "./Campaign";
import { Foundation } from "./Foundation";
import { User } from "./User";

/**
 * @interface Contribution
 * @property {string} id - The ID of the contribution.
 * @property {string} orderNumber - The order number of the contribution.
 * @property {string} name - The name of the contributor.
 * @property {string} lastname - The last name of the contributor.
 * @property {string} email - The email of the contributor.
 * @property {number} amount - The amount of the contribution.
 * @property {string} os - The operating system used by the contributor.
 * @property {string} userId - The ID of the user who made the contribution.
 * @property {string} campaignId - The ID of the campaign to which the contribution was made.
 * @property {string} foundationId - The ID of the foundation to which the contribution was made.
 * @property {string} payment - The payment method used for the contribution.
 * @property {Date | string} createdAt - The date and time when the contribution was made.
 * @property {string} mp_preference_id - The MercadoPago preference ID.
 * @property {MercadoPagoResponse} mp_response - The response details.
 * @property {Campaign} campaign - The campaign to which the contribution was made.
 * @property {User} user - The user who made the contribution.
 * @property {Foundation} foundation - The foundation to which the contribution was made.
 */
export interface Contribution {
  id: string;
  orderNumber: string;
  name: string;
  lastname: string;
  email: string;
  amount: number;
  os: string;
  userId: string;
  campaignId: string;
  foundationId: string;
  payment: string;
  createdAt: Date | string;
  mp_preference_id?: string;
  mp_response?: MercadoPagoResponse;
  campaign?: Campaign;
  user?: User;
  foundation?: Foundation;
}

/**
 * @interface MercadoPagoResponse
 * @property {string} amount - The amount of the contribution.
 * @property {string} campaignId - The ID of the campaign to which the contribution was made.
 * @property {string} collection_id - The collection ID.
 * @property {string} collection_status - The collection status.
 * @property {string} external_reference - The external reference.
 * @property {string} merchant_account_id - The merchant account ID.
 * @property {string} merchant_order_id - The merchant order ID.
 * @property {string} orderId - The order ID.
 * @property {string} payment_id - The payment ID.
 * @property {string} payment_type - The payment type.
 * @property {string} preference_id - The preference ID.
 * @property {string} processing_mode - The processing mode.
 * @property {string} site_id - The site ID.
 * @property {string} status - The status.
 * @property {string} name - The name of the contributor.
 * @property {string} payment - The payment.
 */
export interface MercadoPagoResponse {
  amount: string;               // "10"
  campaignId: string;           // "tyrtVefvWcmytOkMjla8"
  collection_id: string;        // "98450932368"
  collection_status: string;    // "approved"
  external_reference: string;   // "null"
  merchant_account_id: string;  // "null"
  merchant_order_id: string;    // "26939462095"
  orderId: string;              // "K3xXr6WFy5w3e10rxkkD"
  payment_id: string;           // "98450932368"
  payment_type: string;         // "account_money"
  preference_id: string;        // "2097158520-4b3ade88-7603-430e-b848-69545cd2198d"
  processing_mode: string;      // "aggregator"
  site_id: string;              // "MLC"
  status: string;               // "approved" (o "APPROVED", según aparezca)
  name: string;                 // "Diego"
  payment: string;              // "" (cadena vacía)
}