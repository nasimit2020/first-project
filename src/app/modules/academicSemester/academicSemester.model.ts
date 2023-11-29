import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Month } from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: { type: String, required: true, enum: AcademicSemesterName },
    code: { type: String, required: true, enum: AcademicSemesterCode },
    year: { type: String, required: true },
    startMonth: { type: String, required: true, enum: Month },
    endMonth: { type: String, required: true, enum: Month }
}, {
    timestamps: true,
})

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)