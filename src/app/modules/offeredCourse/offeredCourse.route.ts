import { Router } from 'express';
import { OfferedCourseControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = Router();

router.post(
    '/create-offered-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema
    ), OfferedCourseControllers.createOfferedCourse);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseControllers.getAllOfferedCourse
);

router.get(
    '/my-offered-courses',
    auth(USER_ROLE.student),
    OfferedCourseControllers.getMyOfferedCourse
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    OfferedCourseControllers.getSingleOfferedCourse
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseControllers.deleteOfferedCourse
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseControllers.updateOfferedCourse
);

export const offeredCourseRouter = router;