export type InitialTransactionFormState = {
    transferAmount: number
    transferData: string
    receptionData: string
}

export type InitialTransactionComputationOutput = {
    transferAmount: number
    convertedTransferAmount: number
    taxes: number
    convertedTaxes: number
    receptionAmount: number
    convertedReceptionAmount: number
    errorMessage: string | null
    convertedTransferTaxes: number
    convertedReceptionTaxes: number
}


export type PaymentMethodInstance = {
    id: number
    currency: string
    name: string
    symbol: string
    iconUrl: string
    paymentType: string
    cgKey: string
    paymentKey: string
    paymentOrchestrator: string
    usdPrice: number
    minTransferAmount: number
    transferPercentage: number
    receptionPercentage: number
    memePercentage: number
    receptionAutomated: boolean
    transferAutomated: boolean
    onlyForReception: boolean
    onlyForTransfer: boolean
    inputSample: string
    inputRegex: string | null
    inputErrorMessage: string | null
    receptionAddress: string | null
    memo: string | null
    transactionDataRequired: boolean
    precision: number
}

export type Wallet = {
    id: number
    userId: number
    pseudo: string
    value: string
    type: number
    date: string
    isActive: number
}

export type Transaction = {
    id: number
    userId: number
    recipientId: number
    amount: number
    number: string
    relatedTransactionNumber: string
    placeholder: string
    responseCode: string
    otp: string
    status: number
    paymentMethod: number
    type: number
    divider: number
    registrationDate: string
    confirmationDate: string
    currency: string
    successUrl: string
    failureUrl: string
    isManual: string
    isActive: number
    isHidden: number
    relatedTransaction: Array<Transaction>
}


export type ManualTransDetails = {
    paymentMethod: PaymentMethodInstance,
    transferAmount: number,
    orderNumber: string,
    transferData?: string
}

export type TransactionCreatorOutput = {
    errorMessage: string 
    proceedLink: string
    transferId: number
    receptionId: number
    proceedData: string
}