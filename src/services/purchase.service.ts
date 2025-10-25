import mongoose from "mongoose";
import { IPurchaseRequestBody } from "../controllers/purchase.controller";
import { UserModel } from "../models/user.model";
import { ReferralModel } from "../models/referral.model";


const createOrder = async (data: IPurchaseRequestBody) => {
    const user = new mongoose.Types.ObjectId(data?.userId);
    const referral = await ReferralModel.aggregate([
        { $match: { referredUser: user } },
        {
            $lookup: {
                from: "users",
                localField: "referrer",
                foreignField: "_id",
                as: "referrerDetails",
            },
        },
        { $unwind: { path: "$referrerDetails", preserveNullAndEmptyArrays: true } },
    ]);

    // If the user was never referred, skip referral credit logic
    if (!referral.length) {
        console.log("No referral found for this user.");
        return { message: "Order created, no referral applied." };
    }

    const refData = referral[0];
    console.log("Referral data--->", refData);
    const referrerId = refData.referrerDetails?._id;
    const referredUserId = refData.referredUser;

    // Fetch referred user's  to check if credits already earned
    const referredUser = await UserModel.findById(referredUserId);

    if (!referredUser) {
        throw new Error("Referred user not found.");
    }

    // Prevent giving credits more than once
    if (referredUser.hasEarnedReferralCredit) {
        console.log("Referral credits already given for this user.");
        return { message: "Order created, referral credits already applied." };
    }

    // Add credits to both users
    await Promise.all([
        UserModel.findByIdAndUpdate(referrerId, {
            $inc: { credits: 2 },
        }),
        UserModel.findByIdAndUpdate(referredUserId, {
            $inc: { credits: 2 },
            $set: { hasEarnedReferralCredit: true },
        }),
        ReferralModel.updateOne(
            { referredUser: referredUserId },
            { $set: { status: "converted" } }
        ),
    ]);

    console.log("Referral credits applied to both users.");

    return {
        referrerId,
        referredUserId,
    };

};

export default { createOrder };