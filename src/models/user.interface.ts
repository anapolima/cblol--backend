import mongoose from "mongoose";

interface IUser
{
    _id: mongoose.Types.ObjectId
    id: string
    fullname: string
    username: string
    email: string
    password: string
    confirmPassword: string
    encryptedPassword: string
    birthdate: string
    document: string
    type: number | string
    confirm_email_code: string
    recovery_passwd_code: string
    activated_at: string | object
    created_at: string | object
    updated_at: string | object
    inactivated_at: string | object
    deleted_at: string | object
    username_updated: boolean
}

export { IUser };
