import crypto from "crypto";

export const generateReferralCode = (prefix?: string): string => {
    // Generate random string
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    // prefix
    const safePrefix = prefix ? prefix.replace(/[^A-Z0-9]/gi, "").toUpperCase() : "REF";

    return `${safePrefix}-${randomPart}`;
};
