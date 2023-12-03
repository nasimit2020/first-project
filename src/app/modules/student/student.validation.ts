import { z } from 'zod';

const userNameValidationSchema = z.object({
    firstName: z.string()
        .min(1)
        .max(20),
    middleName: z.string(),
    lastName: z.string()
});

const guardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20),
        student: z.object({
            name: userNameValidationSchema,
            gender: z.enum(['male', 'female', 'others']),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            admissionSemester: z.string(),
            profileImg: z.string(),
        })
    })
});

export const StudentValidations = {
    createStudentValidationSchema
};
