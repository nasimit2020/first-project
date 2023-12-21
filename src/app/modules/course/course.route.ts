import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourserControllers } from './course.controller';
import auth from '../../middlewares/auth';



const router = express.Router()

router.post('/create-course', auth('admin'), validateRequest(CourseValidations.createCourseValidationSchema), CourserControllers.createCourse);

router.get('/', auth('admin', 'faculty', 'student'), CourserControllers.getAllCourses);

router.get('/:id', auth('admin'), CourserControllers.getSingleCourse);

router.delete('/:id', auth('admin'), CourserControllers.deleteCourse);

router.put('/:courseId/assign-faculties', validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourserControllers.assignFacultiesWithCourse);

router.delete('/:courseId/remove-faculties', validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourserControllers.removeFacultiesFromCourse);

router.patch('/:id', validateRequest(CourseValidations.updateCourseValidationSchema), CourserControllers.updateCourse);

export const CourserRouters = router;