import { IUser } from "./user.interface";
import { Schema } from "mongoose";
import { v4 } from "uuid";

const UserSchema = new Schema<IUser>({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        index: true,
        default: v4,
        unique: true
    },
    document: {
        type: String,
        required: true,
        index: true,
    },
    birthdate: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        alias: "encryptedPassword"
    },
    type: {
        type: Number,
        required: true,
        default: 1
    },
    confirm_email_code: {
        type: String,
        required: false,
        alias: ""
    },
    recovery_passwd_code: {
        type: String,
        required: false,
    },
    activated_at: {
        type: String,
        required: false
    },
    created_at: {
        type: String,
        required: false
    },
    updated_at: {
        type: String,
        required: false
    },
    inactivated_at: {
        type: String,
        required: false
    },
    deleted_at: {
        type: String,
        required: false
    },
    username_updated: {
        type: Boolean,
        default: false,
        required: true
    }
});

export { UserSchema };
