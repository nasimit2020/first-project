import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Month } from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: { type: String, required: true, enum: AcademicSemesterName },
    year: { type: String, required: true },
    code: { type: String, required: true, enum: AcademicSemesterCode },
    startMonth: { type: String, required: true, enum: Month },
    endMonth: { type: String, required: true, enum: Month }
}, {
    timestamps: true,
});

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        year: this.year,
        name: this.name,
    })
    if (isSemesterExists) {
        throw new Error("Semester is already exists !");
    }
    next()
})

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)