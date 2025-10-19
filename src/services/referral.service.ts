import {ReferralModel} from "../models/referral.model";
import mongoose from "mongoose";


const getReferral  = async (userId: string) => {
    // Find all referrals for this user
    const user = new mongoose.Types.ObjectId(userId);
    // Get total credits earned from a User collection
    const result = await ReferralModel.aggregate([
        { $match: { referrer: user } },

        //  Join with referred users
        {
            $lookup: {
                from: "users",
                localField: "referredUser",
                foreignField: "_id",
                as: "referredUser",
            },
        },
        { $unwind: "$referredUser" },

        //  Join with referrer user (to get their credits)
        {
            $lookup: {
                from: "users",
                localField: "referrer",
                foreignField: "_id",
                as: "referrerUser",
            },
        },
        { $unwind: "$referrerUser" },

        //  Compute key metrics
        {
            $group: {
                _id: "$referrerUser._id",
                totalReferredUsers: { $sum: 1 },
                referredUsersWhoPurchased: {
                    $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] },
                },
                totalCreditsEarned: { $first: "$referrerUser.credits" },
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

    // No referrals found — fallback defaults
    if (!result?.length) {
        return {
            totalReferredUsers: 0,
            referredUsersWhoPurchased: 0,
            totalCreditsEarned: 0,
            referredUsers: [],
        };
    }

    // Return clean structured data
    const stats = result[0];
    return {
        totalReferredUsers: stats?.totalReferredUsers,
        referredUsersWhoPurchased: stats?.referredUsersWhoPurchased,
        totalCreditsEarned: stats?.totalCreditsEarned,
        referredUsers: stats?.referredUsers,
    };
};
export default {getReferral};
