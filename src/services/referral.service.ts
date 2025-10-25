import {ReferralModel} from "../models/referral.model";
import mongoose from "mongoose";
import {UserModel} from "../models/user.model";

const getReferral = async (userId: string) => {
    const user = new mongoose.Types.ObjectId(userId);

    // Find if user is a referrer or referred user
    const isReferrer = await ReferralModel.exists({ referrer: user });
    const isReferredUser = await ReferralModel.exists({ referredUser: user });

    // If user is a referrer
    if (isReferrer) {
        const result = await ReferralModel.aggregate([
            { $match: { referrer: user } },
            {
                $lookup: {
                    from: "users",
                    localField: "referredUser",
                    foreignField: "_id",
                    as: "referredUser",
                },
            },
            { $unwind: "$referredUser" },
            {
                $group: {
                    _id: "$referrer",
                    totalReferredUsers: { $sum: 1 },
                    referredUsersWhoPurchased: {
                        $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] },
                    },
                    referredUsers: {
                        $push: {
                            name: "$referredUser.name",
                            email: "$referredUser.email",
                            credits: "$referredUser.credits",
                            status: "$status",
                            createdAt: "$createdAt",
                        },
                    },
                },
            },
        ]);

        const refUser = await UserModel.findById(user);

        return {
            role: "referrer",
            totalReferredUsers: result[0]?.totalReferredUsers || 0,
            referredUsersWhoPurchased: result[0]?.referredUsersWhoPurchased || 0,
            totalCreditsEarned: refUser?.credits || 0,
            referredUsers: result[0]?.referredUsers || [],
        };
    }

    // If user is a referred user
    if (isReferredUser) {
        const result = await ReferralModel.aggregate([
            { $match: { referredUser: user } },
            {
                $lookup: {
                    from: "users",
                    localField: "referrer",
                    foreignField: "_id",
                    as: "referrerUser",
                },
            },
            { $unwind: "$referrerUser" },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    referrerName: "$referrerUser.name",
                    referrerEmail: "$referrerUser.email",
                },
            },
        ]);

        const referredUser = await UserModel.findById(user);

        return {
            role: "referredUser",
            referredBy: result[0]?.referrerName || null,
            referredByEmail: result[0]?.referrerEmail || null,
            totalCreditsEarned: referredUser?.credits || 0,
            status: result[0]?.status || "pending",
        };
    }
    return null
};
export default {getReferral};
