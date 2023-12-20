import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from 'bcrypt'


const loginUser = async (payload: TLoginUser) => {
    //checking if the user is exists
    const isUserExists = await User.findOne({ id: payload?.id });
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
    }

    //checking if the user is deleted
    const isUserDeleted = isUserExists?.isDeleted;
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'The user is already deleted')
    }

    //checking if the user is blocked
    const isUserBlocked = isUserExists?.status;
    if (isUserBlocked === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked')
    }

    // checking if the password is correct
    const isPasswordMatch = await bcrypt.compare(payload?.password, isUserExists?.password);
    console.log(isPasswordMatch);


    // Access Granted: Send AccessToken, RefreshToken
    return {}
};

export const AuthServices = {
    loginUser
}