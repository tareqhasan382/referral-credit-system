import {UserModel} from "../models/user.model";
import {ILoginUser, IRegisterUser} from "../types/user.interface";
import bcrypt from "bcryptjs";
import {generateAccessToken, generateRefreshToken} from "../utils/generateToken";
import {generateReferralCode} from "../utils/generateReferralCode";
import {ReferralModel} from "../models/referral.model";

const registerUser = async (data: IRegisterUser) => {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) throw new Error("Email already registered");

    let referralCode: string;
    // Ensure uniqueness for the new user
    do {
        referralCode = generateReferralCode(data.name || "USER");
    } while (await UserModel.exists({ referralCode }));

    // Find referrer
    const referrer = data.referralCode
        ? await UserModel.findOne({ referralCode: data.referralCode })
        : null;

    // Create new user
    const user = await UserModel.create({
        ...data,
        referralCode,
        referredBy: referrer ? referrer._id : null,
    });

    // If a referrer exists, create a Referral record and update referrer
    if (referrer) {
        const referral = await ReferralModel.create({
            referrer: referrer._id,
            referredUser: user._id,
            status: "pending",
        });

        // Update the referrer document to track the new referral
        referrer.referrals.push(referral._id);
        await referrer.save();
    }
    // Clean and return user data
    const userObj = user.toObject() as any;
    delete userObj.password;
    return userObj;
};

const loginUser = async (payload:ILoginUser) => {
    const existingUser = await UserModel.findOne({ email:payload.email }).select("+password");
    if (!existingUser) throw new Error("User Doesn't Exist!");
    // Verify if the password is correct
    const isPasswordMatched = await bcrypt.compare(payload.password,existingUser.password);
    if (!isPasswordMatched) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(existingUser._id.toString());
    const refreshToken = generateRefreshToken(existingUser._id.toString());

    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // await RefreshTokenModel.create({
    //     user: existingUser._id,
    //     token: refreshToken,
    //     expiresAt,
    // });
    const { password, ...userData } = existingUser.toObject();
    return { user:userData, accessToken, refreshToken };
};
export default { registerUser ,loginUser};

