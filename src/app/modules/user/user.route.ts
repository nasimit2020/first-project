import express from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';

const router = express.Router()

router.post('/create-student', validateRequest(StudentValidations.createStudentValidationSchema), UserControllers.createStudent)

router.post('/create-faculty', validateRequest(FacultyValidation.createFacultyValidationSchema), UserControllers.createFaculty);

router.post('/create-admin', validateRequest(AdminValidations.createAdminValidationSchema), UserControllers.createAdmin);


export const UserRoutes = router;