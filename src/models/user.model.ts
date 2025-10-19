import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import {IUser} from "../types/user.interface";
import config from "../config";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        referralCode: { type: String, unique: true },
        referredBy: {type: Schema.Types.ObjectId, ref: 'User' },
        credits: { type: Number, default: 0 },
        hasEarnedReferralCredit: { type: Boolean, default: false },
        referrals: [{type: Schema.Types.ObjectId, ref: 'Referral'}]
    },
    { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(Number(config.bycrypt_salt_rounds) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// helper to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = model<IUser>("User", userSchema);