import { z } from 'zod';

const userNameZodValidationSchema = z.object({
    firstName: z.string()
        .min(1, { message: 'First Name is Required' })
        .max(20, { message: 'First Name cannot be more than 20 characters' }),
    middleName: z.string(),
    lastName: z.string()
});

const guardianZodValidationSchema = z.object({
    fatherName: z.string().min(1, { message: 'Father Name is Required' }),
    fatherOccupation: z.string().min(1, { message: 'Father Occupation is Required' }),
    fatherContactNo: z.string().min(1, { message: 'Father Contact No is Required' }),
    motherName: z.string().min(1, { message: 'Mother Name is Required' }),
    motherOccupation: z.string().min(1, { message: 'Mother Occupation is Required' }),
    motherContactNo: z.string().min(1, { message: 'Mother Contact No is Required' }),
});

const localGuardianZodValidationSchema = z.object({
    name: z.string().min(1, { message: 'Local Guardian Name is Required' }),
    occupation: z.string().min(1, { message: 'Local Guardian Occupation is Required' }),
    contactNo: z.string().min(1, { message: 'Local Guardian Contact No is Required' }),
    address: z.string().min(1, { message: 'Local Guardian Address is Required' }),
});

const studentZodValidationSchema = z.object({
    id: z.string().min(1, { message: 'Student ID is Required' }),
    name: userNameZodValidationSchema,
    gender: z.enum(['male', 'female', 'others']),
    dateOfBirth: z.string(),
    email: z.string().email({ message: 'Email is not valid' }),
    contactNo: z.string().min(1, { message: 'Contact No is Required' }),
    emergencyContactNo: z.string().min(1, { message: 'Emergency Contact No is Required' }),
    bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']),
    presentAddress: z.string().min(1, { message: 'Present Address is Required' }),
    permanentAddress: z.string().min(1, { message: 'Permanent Address is Required' }),
    guardian: guardianZodValidationSchema,
    localGuardian: localGuardianZodValidationSchema,
    profileImg: z.string(),
    isActive: z.enum(['active', 'blocked']).default('active'),
});

export default studentZodValidationSchema;
