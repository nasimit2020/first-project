import { AcademicDepartment } from './../academicDepartment/academicDepartment.model';
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface"
import { OfferedCourse } from "./offeredCourse.model"
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';


const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {

    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;
    // check if the semester registration id is exists!
    const isSemesterRegistrationExits = await SemesterRegistration.findById(semesterRegistration)
    if (!isSemesterRegistrationExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found')
    }

    const academicSemester = isSemesterRegistrationExits.academicSemester;

    const isAcademicFacultyExits = await AcademicFaculty.findById(academicFaculty)
    if (!isAcademicFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found')
    }

    const isAcademicDepartmentExits = await AcademicDepartment.findById(academicDepartment)

    if (!isAcademicDepartmentExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
    }

    const isCourseExits = await Course.findById(course)
    if (!isCourseExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }

    const isFacultyExits = await Faculty.findById(faculty)
    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
    }

    //check if the department is belong to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        academicFaculty,
        _id: academicDepartment
    });

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `The ${isAcademicDepartmentExits.name} is not belong to ${isAcademicFacultyExits.name}`)
    }

    // check if the same offered course same section in same registered semester exists

    const isSameOfferedCourseExistsWitheSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({ semesterRegistration, course, section });

    if (isSameOfferedCourseExistsWitheSameRegisteredSemesterWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Offered course with same section is already exist!')
    }

    //get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime');
    console.log(assignedSchedules);

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    assignedSchedules.forEach((schedule) => {
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            throw new AppError(httpStatus.CONFLICT, 'This faculty is not available at that time ! choose other time or day!')
        }
    })


    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;

    // return null;
}


export const OfferedCourseServices = {
    createOfferedCourseIntoDB
}