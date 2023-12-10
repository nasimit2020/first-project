import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model"


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

    // step1: basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true });

    // check if there is any pre requisite courses to update
    if (preRequisiteCourse && preRequisiteCourse.length > 0) {
        //filter the deleted fields
        const deletedPreRequisites = preRequisiteCourse.filter(el => el.course && el.isDeleted).map(el => el.course);

        const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $pull: { preRequisiteCourse: { course: { $in: deletedPreRequisites } } }, });

        // filter out the new course fields
        const newPreRequisites = preRequisiteCourse?.filter(el => el.course && !el.isDeleted);

        const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $addToSet: { preRequisiteCourse: { $each: newPreRequisites } }, })

    };

    const result = await Course.findById(id).populate('preRequisiteCourse.course')

    return result;
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
}
export const CourseServices = {
    createCourseIntoDB,
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB
}