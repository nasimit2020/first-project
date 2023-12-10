import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourserControllers } from './course.controller';



const router = express.Router()

router.post('/create-course', validateRequest(CourseValidations.createCourseValidationSchema), CourserControllers.createCourse);

router.get('/', CourserControllers.getAllCourses);

router.get('/:id', CourserControllers.getSingleCourse);

router.delete('/:id', CourserControllers.deleteCourse);

router.put('/:courseId/assign-faculty')

router.patch('/:id', validateRequest(CourseValidations.updateCourseValidationSchema), CourserControllers.updateCourse);

export const CourserRouters = router;