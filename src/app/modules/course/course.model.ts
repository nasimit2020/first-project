import { model, Schema } from "mongoose";
import { TCourse, TPreRequisiteCourses } from "./course.interface";

export const preRequisiteCourses = new Schema<TPreRequisiteCourses>({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: [true, 'Course is Required'] },
    isDeleted: { type: Boolean, default: false }
})

export const courseSchema = new Schema<TCourse>({
    title: { type: String, required: [true, 'Title is Required'], trim: true },
    prefix: { type: String, required: [true, 'Prefix is Required'], trim: true },
    code: { type: Number, required: [true, 'Code is Required'], trim: true },
    credits: { type: Number, required: [true, 'Code is Required'], trim: true },
    preRequisiteCourse: [preRequisiteCourses],
    isDeleted: { type: Boolean, default: false }
})

export const Course = model<TCourse>('Course', courseSchema)