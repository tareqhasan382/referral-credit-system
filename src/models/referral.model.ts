import { Schema, model } from "mongoose";
import {IReferral} from "../types/referral.Interface";

const referralSchema = new Schema<IReferral>(
    {
        referrer: {type: Schema.Types.ObjectId, ref: "User" }, // User who invited
        referredUser: {type: Schema.Types.ObjectId, ref: "User", required: true}, // New user
        status: {type: String, enum: ["pending", "converted"], default: "pending"},
    },
    { timestamps: true }
);

export const ReferralModel = model<IReferral>("Referral", referralSchema);