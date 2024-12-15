/**
 * @interface User
 * @property {string} [id] - The unique identifier of the user.
 * @property {string} [uid] - The unique identifier of the user in Firebase.
 * @property {string} [rut] - The RUT of the user.
 * @property {string} [checkDigit] - The check digit of the RUT.
 * @property {string} name - The name of the user.
 * @property {string} [lastname] - The last name of the user.
 * @property {string} email - The email of the user.
 * @property {number} [phone] - The phone number of the user.
 * @property {string} [gender] - The gender of the user (M = Male, F = Female, O = Other, E = Empty).
 * @property {string} [profile] - The profile of the user.
 * @property {string} [photoURL] - The photo URL of the user.
 * @property {boolean} [status] - The status of the user (true = enabled, false = disabled).
 * @property {string} [foundation] - The foundation associated with the user.
 */
export interface User {
    id?: string;
    uid?: string;
    rut?: string;
    checkDigit?: string;
    name: string;
    lastname?: string;
    email: string;
    phone?: number;
    gender?: string;
    profile?: string;
    photoURL?: string;
    status?: boolean;
    foundation?: string;
}