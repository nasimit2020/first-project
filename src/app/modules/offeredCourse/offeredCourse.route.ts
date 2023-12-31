import { Router } from 'express';
import { OfferedCourseControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';


const router = Router();

router.post('/create-offered-course', validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema), OfferedCourseControllers.createOfferedCourse);

router.get('/', OfferedCourseControllers.getAllOfferedCourse);

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);

router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse);

router.patch('/:id', validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema), OfferedCourseControllers.updateOfferedCourse);

export const offeredCourseRouter = router;