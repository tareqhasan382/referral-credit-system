import { Types } from "mongoose";

export type IReferral = {
    referrer: Types.ObjectId;
    referredUser: Types.ObjectId;
    status: "pending" | "converted";
};
