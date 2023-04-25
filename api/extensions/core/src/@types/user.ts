export type UserToken = {
    id: number,
    public_key: string
}


type User = {
    id: string,
    date_created: string,
    date_updated: string | null,
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string | null,
    country: number,
    city: number,
    address: string | null,
    address_2: string | null,
    email_verified: number | boolean,
    phone_verified: number | boolean,
    public_key: string,
    otp: number,
    verification_code: string,
    account_locked: number,
    alert_level: number,
    account_deleted: number
    status: "active" | "archived" | "suspended"
}

export default User;