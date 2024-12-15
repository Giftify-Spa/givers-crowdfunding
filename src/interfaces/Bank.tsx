/**
 * Interfaces for Bank
 * @interface Bank
 * @property {string} id - The unique identifier of the bank.
 * @property {string} name - The name of the bank.
 * @property {Country} country - The country where the bank is located.
 * @property {Product[]} products - The products offered by the bank.
 * @property {ObjectX} object - The object type.
 * @property {Type} type - The type of the bank.
 */
export interface Bank {
    id:       string;
    name:     string;
    country:  Country;
    products: Product[];
    object:   ObjectX;
    type:     Type;
}

/**
 * @enum Country
 */
export enum Country {
    Cl = "cl",
}

/**
 * @enum ObjectX
 */
export enum ObjectX {
    Institution = "institution",
}

/**
 * @interface Product
 * @property {Name} name - The name of the product.
 * @property {HolderType} holder_type - The holder type of the product.
 */
export interface Product {
    name:        Name;
    holder_type: HolderType;
}

/**
 * @enum HolderType
 * @property {string} Business - The business type.
 * @property {string} Individual - The individual type.
 */
export enum HolderType {
    Business = "business",
    Individual = "individual",
}

/**
 * @enum Name
 * @property {string} Movements - The movements type.
 * @property {string} Payments - The payments type.
 * @property {string} Payouts - The payouts type.
 * @property {string} Subscription - The subscription type.
 */
export enum Name {
    Movements = "movements",
    Payments = "payments",
    Payouts = "payouts",
    Subscription = "subscription",
}

/**
 * @enum Type
 * @property {string} Bank - The bank type.
 */
export enum Type {
    Bank = "bank",
}
