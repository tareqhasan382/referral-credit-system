import {UserModel} from "../models/user.model";
import {ILoginUser, IRegisterUser} from "../types/user.interface";
import bcrypt from "bcryptjs";
import {generateAccessToken, generateRefreshToken} from "../utils/generateToken";


const registerUser = async (data:IRegisterUser ) => {
    const existingUser = await UserModel .findOne({ email: data.email });
    if (existingUser) throw new Error("Email already registered");
    const user = await UserModel.create(data);
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
    //
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