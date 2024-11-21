export interface Bank {
    id:       string;
    name:     string;
    country:  Country;
    products: Product[];
    object:   ObjectX;
    type:     Type;
}

export enum Country {
    Cl = "cl",
}

export enum ObjectX {
    Institution = "institution",
}

export interface Product {
    name:        Name;
    holder_type: HolderType;
}

export enum HolderType {
    Business = "business",
    Individual = "individual",
}

export enum Name {
    Movements = "movements",
    Payments = "payments",
    Payouts = "payouts",
    Subscription = "subscription",
}

export enum Type {
    Bank = "bank",
}
