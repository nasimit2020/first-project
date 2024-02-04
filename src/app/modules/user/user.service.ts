/* eslint-disable @typescript-eslint/no-explicit-any */
// import { JwtPayload, jwt } from 'jsonwebtoken';
import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import TFaculty from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { Admin } from "../admin/admin.model";
import { TAdmin } from "../admin/admin.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";


const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
    // Create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, use default password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';
    userData.email = payload.email;

    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);
    if (!admissionSemester) {
        throw new AppError(400, "Admission Semester not found");
    }

    // find department
    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new AppError(400, "Academic Department not found");
    }

    payload.academicFaculty = academicDepartment.academicFaculty;

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        // set generated id
        userData.id = await generateStudentId(admissionSemester);

        if (file) {
            const imageName = `${userData?.id}${payload?.name?.firstName}`;
            const path = file?.path;

            // send image to cloudinary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImg = secure_url as string;
        }



        //create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        // Create a student
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to Create user");
        }
        // set id, _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;


        //create a Student (transaction-2)
        const newStudent = await Student.create([payload], { session })
        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create Student')
        }

        await session.commitTransaction();
        await session.endSession();
        return newStudent;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }

};

const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty) => {
    const userData: Partial<TUser> = {};
    userData.password = password || (config.default_password as string);
    userData.role = 'faculty';
    userData.email = payload.email;

    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

    if (!academicDepartment) {
        throw new AppError(400, "Academic Department not found");
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        userData.id = await generateFacultyId();

        if (file) {
            const imageName = `${userData?.id}${payload?.name?.firstName}`;
            const path = file?.path;
            // send image to cloudinary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImg = secure_url as string;
        }



        const newUser = await User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create user')
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;


        const newFaculty = await Faculty.create([payload], { session });
        if (!newFaculty) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create Faculty')
        }

        await session.commitTransaction();
        await session.endSession();
        return newFaculty;


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error)
    }
}

const createAdminIntoDB = async (file: any, password: string, payload: TAdmin) => {
    const userData: Partial<TUser> = {};
    userData.password = password || (config.default_password as string);
    userData.role = 'admin';
    userData.email = payload.email;

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        userData.id = await generateAdminId();

        if (file) {
            const imageName = `${userData?.id}${payload?.name?.firstName}`;
            const path = file?.path;
            // send image to cloudinary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImg = secure_url as string;
        }

        const newUser = await User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create user')
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;


        const newAdmin = await Admin.create([payload], { session });
        if (!newAdmin) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create Admin')
        }

        await session.commitTransaction();
        await session.endSession();
        return newAdmin;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error)
    }
}

const getMeFromDB = async (userId: string, role: string) => {
    let result = null;

    if (role === 'admin') {
        result = await Admin.findOne({ id: userId }).populate('user');
    }

    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId }).populate('user');
    }

    if (role === 'student') {
        result = await Student.findOne({ id: userId }).populate('user');
    }

    return result;

}

const changeUserStatusIntoDB = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result;
}

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMeFromDB,
    changeUserStatusIntoDB
}