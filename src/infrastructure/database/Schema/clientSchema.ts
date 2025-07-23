 
import { model, Schema, Types } from "mongoose";
import { IClient } from "/domain/entities/Client";

const clientSchema = new Schema<IClient>({ 
    userId: {
        type: Types.ObjectId,
        require: true,
    },
    companyName: {
        type: String,
        require: true,
    },
    currency: {
        type: String,
        require: true,
        default: "INR",
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    panNumber: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now(),
    },
});

export const ClientModel = model("client", clientSchema);
