import { z } from "zod";
import { BloodGroup, Gender } from "./faculty.constant";

const createFacultyNameValidationSchema = z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
})


export const createFacultyValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20),
        faculty: z.object({
            name: createFacultyNameValidationSchema,
            designation: z.string(),
            gender: z.enum([...Gender] as [string, ...string[]]),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            profileImage: z.string(),
            academicDepartment: z.string()
        })
    })
})

export const FacultyValidation = {
    createFacultyValidationSchema
}