/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICampaign {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    mainImage: string;
    createdBy: string;
    daysLeft: number;
    amountRaised: string;
    goal: string;
    contributors: number;
    createdByImage: string;
    category: string;
    country: string;
    type: string | null;
}

export interface ITestimonial {
    id: string;
    testimonial: string;
    createdBy: string;
    createdByImage: string;
    company: string;
    jobPosition: string;
}

export interface ICountry {
    name: string;
    code: string;
    emoji: string;
    unicode: string;
    image: string;
}

export interface ICurrency {
    cc: string;
    symbol: string;
    name: string;
}

export interface IBank {
    id: string;
    name: string;
    country: string;
    object: string;
    type: string;
}

export interface ICampaignResponse {
    success: boolean;
    message?: string;
    error?: any;
}

export interface IFoundationResponse {
    success: boolean;
    message?: string;
    error?: any;
}

export interface IPayAccount {
    rut: string;
    holderName: string;
    accountNumber: string;
    bank: string;
}
