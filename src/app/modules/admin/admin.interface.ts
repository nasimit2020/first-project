import { Model, Types } from "mongoose";

export type TAdminName = {
    firstName: string;
    middleName: string;
    lastName: string;
}

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TAdmin = {
    id: string;
    user: Types.ObjectId;
    name: TAdminName;
    designation: string;
    gender: TGender;
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: TBloodGroup;
    presentAddress: string;
    permanentAddress: string;
    profileImg?: string;
    isDeleted: boolean;
}

export interface AdminModel extends Model<TAdmin> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TAdmin | null>;
}