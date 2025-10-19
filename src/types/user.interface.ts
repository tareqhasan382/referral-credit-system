
export type IUser = {
    _id?: string;
    name: string;
    email: string;
    password: string;
    referralCode: string;
    referredBy?: string;
    credits: number;
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