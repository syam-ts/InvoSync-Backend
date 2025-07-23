import { IUser } from "/domain/entities/User";
import { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    mobile: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    gender: {
        type: String,
        require: true,
        enum: ["male", "female"],
    },
    country: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true,
    },
    language: {
        type: String,
        require: true,
    },
});

export const UserModel = model("user", userSchema);
