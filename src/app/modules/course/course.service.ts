import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourse.course'), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
}

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourse.course');
    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourse, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // step1: basic course info update
        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });

        if (!updatedBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to update");
        }

        // check if there is any pre requisite courses to update
        if (preRequisiteCourse && preRequisiteCourse.length > 0) {
            //filter the deleted fields
            const deletedPreRequisites = preRequisiteCourse.filter(el => el.course && el.isDeleted).map(el => el.course);

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $pull: { preRequisiteCourse: { course: { $in: deletedPreRequisites } } }, }, { new: true, runValidators: true, session });

            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, "Failed to update");
            }

            // filter out the new course fields
            const newPreRequisites = preRequisiteCourse?.filter(el => el.course && !el.isDeleted);

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $addToSet: { preRequisiteCourse: { $each: newPreRequisites } }, }, { new: true, runValidators: true, session })

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, "Failed to update");
            }
            const result = await Course.findById(id).populate('preRequisiteCourse.course')

            return result;
        };



        session.commitTransaction();
        session.endSession();

    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update");
    }



};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
}

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        { upsert: true, new: true });

    return result;
}

const removeFacultiesFromCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } }
        },
        { new: true });

    return result;
};


export const CourseServices = {
    createCourseIntoDB,
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB
}