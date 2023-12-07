import { Schema, model } from "mongoose";
import TAdmin, { TAdminName } from "./admin.interface";
import { BloodGroup, Gender } from "./admin.constant";


const adminNameSchema = new Schema<TAdminName>({
    firstName: { type: String, required: [true, 'First Name is Required'] },
    middleName: { type: String, required: [true, 'Middle Name is Required'] },
    lastName: { type: String, required: [true, 'Last Name is Required'] },
})

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

const adminSchema = new Schema<TAdmin>({
    id: { type: String, required: [true, 'ID is required'], unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: adminNameSchema, required: true },
    designation: { type: String, required: [true, 'Designation is Required'] },
    gender: { type: String, enum: { values: Gender, message: '{VALUE} is not valid gender' }, required: true },
    dateOfBirth: { type: Date },
    email: { type: String, required: [true, 'Email is Required'] },
    contactNo: { type: String, required: [true, 'Contact No is Required'] },
    emergencyContactNo: { type: String, required: [true, 'Emergency contact no is required'] },
    bloodGroup: { type: String, enum: { values: BloodGroup, message: '{VALUE} is not a valid blood group' } },
    presentAddress: { type: String, required: [true, 'Present address is required'] },
    permanentAddress: { type: String, required: [true, 'Permanent address is required'] },
    profileImg: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    toJSON: {
        virtuals: true,
    }
})

export const Admin = model<TAdmin>("Faculty", adminSchema)