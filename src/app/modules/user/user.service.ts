import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import TFaculty from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";


const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // Create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, use default password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';


    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        // set generated id
        userData.id = await generateStudentId(admissionSemester);

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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
    const userData: Partial<TUser> = {};
    userData.password = password || (config.default_password as string);
    userData.role = 'faculty';

    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

    if (!academicDepartment) {
        throw new AppError(400, "Academic Department not found");
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        userData.id = await generateFacultyId();
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


    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error)
    }
}

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB
}