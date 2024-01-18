import { Student } from './../student/student.model';
import { OfferedCourse } from './../offeredCourse/offeredCourse.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TEnrolledCourse } from "./enrolledCourse.interface"
import { EnrolledCourse } from "./enrolledCourse.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Course } from "../course/course.model";
import { Faculty } from '../faculty/faculty.model';

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    const { offeredCourse } = payload;
    /**
     * Step1: Check if the offered course is exists
     * Step2: Check if the student is already enrolled
     * Step3: Check if the max credits exceed
     * Step4: create an enrolled course 
     */

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Room is full!')
    }

    const student = await Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
    }

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse,
        student: student._id
    })

    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, 'This student is already enrolled this course')
    }

    //check total credits exceeds maxCredit
    const semesterRegistration = await SemesterRegistration.findById(
        isOfferedCourseExists.semesterRegistration
    ).select('maxCredit')

    const maxCredit = semesterRegistration?.maxCredit;

    const enrolledCourse = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                student: student._id,
            },

        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData'
            }
        },
        {
            $unwind: '$enrolledCourseData'
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' }
            }
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1
            }
        }
    ]);

    //total enrolled credits + new enrolled course credit > maxCredit
    const course = await Course.findById(isOfferedCourseExists.course)
    const currentCredit = course?.credits;
    const totalCredits = enrolledCourse.length > 0 ? enrolledCourse[0].totalEnrolledCredits : 0;

    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your have exceeded maximum number of credits!");

    }



    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const result = await EnrolledCourse.create([{
            semesterRegistration: isOfferedCourseExists.semesterRegistration,
            academicSemester: isOfferedCourseExists.academicDepartment,
            academicFaculty: isOfferedCourseExists.academicFaculty,
            academicDepartment: isOfferedCourseExists.academicDepartment,
            offeredCourse,
            course: isOfferedCourseExists.course,
            student: student._id,
            faculty: isOfferedCourseExists.faculty,
            isEnrolled: true,
        }], { session });

        if (!result) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enrolled this course')
        }

        const maxCapacity = isOfferedCourseExists.maxCapacity;
        await OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1,
        })

        await session.commitTransaction()
        await session.endSession()

        return result;

    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error);

    }
};

const updateEnrolledCourseMarksIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => {

    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration)
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found!')
    }

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
    }

    const isStudentExists = await Student.findById(student)
    if (!isStudentExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
    }

    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })
    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!')
    }

    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id
    })


    if (!isCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, 'Your are forbidden!')
    }

    const modifiedData: Record<string, unknown> = {
        ...courseMarks,
    };

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isCourseBelongToFaculty._id,
        modifiedData,
        {
            new: true,
        },
    );

    return result;

}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB
}