import express from 'express';
import { userController } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router()

router.post('/create-student', validateRequest(StudentValidations.createStudentValidationSchema), userController.createStudent)


export const UserRoutes = router;