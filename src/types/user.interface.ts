import {Types} from "mongoose";

export type IUser = {
    _id?: string;
    name: string;
    email: string;
    password: string;
    referralCode: string;
    referredBy?: Types.ObjectId;
    credits: number;
    hasEarnedReferralCredit: boolean;
    referrals: Types.ObjectId[];
};

export type IRegisterUser = {
    name: string;
    email: string;
    password: string;
    referralCode: string;
};

export type ILoginUser = {
    email: string;
    password: string;
};

export type IUserResponse = {
    _id?: string;
    name: string;
    email: string;
    password: string;
    referralCode: string;
    referredBy?: string;
    credits: number;
};