import {UserModel} from "../models/user.model";
import {IRegisterUser} from "../types/user.interface";


const registerUser = async (data:IRegisterUser ) => {
    const existingUser = await UserModel .findOne({ email: data.email });
    if (existingUser) throw new Error("Email already registered");
    const user = await UserModel.create(data);
    const userObj = user.toObject() as any;
    delete userObj.password;
    return userObj;
};


export default { registerUser };