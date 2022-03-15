import { Transaction } from './transaction';
export type UserToken = {
    id: number,
    public_key: string
}


type User = { 
    id: number;
    email: string
    publicKey: string
    isLocked: number
    alertLevel: number
    isActive: number
    role: number
    referalToken: string
    balance: number
    currency: string
    address: string
    address2: string | null
    addressDocument: string
    addressDocumentType: number
    addressDocumentVerified: number
    apiActivated: number
    apiToken: string
    bio: string
    city: string
    country: number
    displayName: string
    emailVerified: number
    firstName: string
    language: string
    lastName: string
    legalDocument: string
    legalDocumentType: number
    legalDocumentVerified: number
    parentReferalToken: string
    phone: string
    phoneVerified: number
    postalCode: string
    registrationDate: string
    securityLevel: number
    selfie: string
    thumb: string
    totalAffiliates: number
    transactionHistory: {
        transactions: Array<Transaction>
        totalMonthlyAmount:	number
        totalTransactionsAmount: number
        totalTransferAmount: number
        totalReceptionAmount: number
    }
    website: string
}

export default User;