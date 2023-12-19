import { Router } from 'express';
import { OfferedCourseControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';


const router = Router();

router.post('/create-offered-course', validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema), OfferedCourseControllers.createOfferedCourse)


export const offeredCourseRouter = router;