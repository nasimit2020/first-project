import { Schema, model } from "mongoose";
import TFaculty, { TFacultyName } from "./faculty.interface";
import { BloodGroup, Gender } from "./faculty.constant";

const facultyNameSchema = new Schema<TFacultyName>({
    firstName: { type: String, required: [true, 'First Name is Required'], trim: true, maxlength: [20, 'Name can not be more than 20 characters'] },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: [true, 'Last Name is required'], maxlength: [20, 'Name can not be more than 20 characters'], }
})

const facultySchema = new Schema<TFaculty>({
    id: { type: String, required: [true, 'ID is Required'], unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: facultyNameSchema, required: [true, 'Name is Required'] },
    designation: { type: String, required: [true, 'Designation is Required'] },
    gender: { type: String, enum: { values: Gender, message: '{VALUE} is not a valid gender' }, required: [true, 'Gender is required'] },
    dateOfBirth: { type: Date },
    email: { type: String, required: [true, 'Email is Required'] },
    contactNo: { type: String, required: [true, 'Contact No is Required'] },
    emergencyContactNo: { type: String, required: [true, 'Emergency contact no is required'] },
    bloodGroup: { type: String, enum: { values: BloodGroup, message: '{VALUE} is not a valid blood group' } },
    presentAddress: { type: String, required: [true, 'Present address is required'], },
    permanentAddress: { type: String, required: [true, 'Permanent address is required'], },
    profileImg: { type: String, required: true },
    academicDepartment: { type: Schema.Types.ObjectId, ref: 'AcademicDepartment' },
    isDeleted: { type: Boolean, default: false },
}, {
    toJSON: {
        virtuals: true,
    }
})

facultySchema.virtual('fullName').get(function () {
    return (
        this?.name?.firstName +
        '' +
        this?.name?.middleName +
        '' +
        this?.name?.lastName
    )
});

export const Faculty = model<TFaculty>("Faculty", facultySchema)