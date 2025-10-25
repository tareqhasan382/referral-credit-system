import { Types } from "mongoose";
import { IPurchaseRequestBody } from "../controllers/purchase.controller";
import { UserModel } from "../models/user.model"; // Import your User Model
import { ReferralModel } from "../models/referral.model"; // Import your Referral Model
import { OrderModel } from "../models/order.model"; // Import your Order Model

const CREDIT_AMOUNT = 2;
const handleReferralCredit = async (referredUserId: Types.ObjectId) => {
    const referredUser = await UserModel.findById(referredUserId);

    if (!referredUser || referredUser.hasEarnedReferralCredit) return;

    const referralRecord = await ReferralModel.findOne({
        referredUser: referredUserId,
        status: "pending",
    });

    if (!referralRecord) return;

    // 3. Find the referrer (Lina)
    const referrer = await UserModel.findById(referralRecord.referrer);
    if (!referrer) return console.error("Referrer not found, check data integrity.");

    // --- Award Credits and Update Status ---

    // Award to Referrer (Lina)
    referrer.credits += CREDIT_AMOUNT;
    await referrer.save();

    // Award to Referred User (Ryan) and set flag to prevent future awards
    referredUser.credits += CREDIT_AMOUNT;
    referredUser.hasEarnedReferralCredit = true;
    await referredUser.save();

    // Update Referral Status
    referralRecord.status = "converted";
    await referralRecord.save();

    console.log(`Referral converted. ${referrer.name} and ${referredUser.name} both earned ${CREDIT_AMOUNT} credits.`);
};

const createOrder = async (data: IPurchaseRequestBody) => {
    console.log("data---------->", data);
    // const userId = new Types.ObjectId(data.userId);
    // const completedOrdersCount = await OrderModel.countDocuments({
    //     user: userId,
    //     status: 'completed'
    // });

    //const isFirstPurchase = completedOrdersCount === 0;

    // 2. Create the new Order record
    // const newOrder = await OrderModel.create({
    //     user: userId,
    //     totalAmount: data.amount,
    //     status: 'completed',
    // });
    //
    // if (isFirstPurchase) {
    //     console.log("First purchase detected. Executing referral credit logic...");
    //     await handleReferralCredit(userId);
    // } else {
    //     console.log("Not the first purchase; skipping referral credit.");
    // }
    //
    // return {
    //     orderId: newOrder._id,
    //     userId: userId,
    //     amount: newOrder.totalAmount,
    //     isCreditAwarded: isFirstPurchase
    // };
    return data;
};

export default { createOrder };