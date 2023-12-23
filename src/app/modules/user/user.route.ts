import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router()

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent
)

router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(FacultyValidation.createFacultyValidationSchema),
    UserControllers.createFaculty
);

router.post(
    '/create-admin',
    // auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin
);

router.get(
    '/me',
    auth('student', 'faculty', 'admin'),
    UserControllers.getMe
);

router.post(
    '/change-status/:id',
    auth('admin'),
    validateRequest(UserValidation.changeUserStatusValidationSchema),
    UserControllers.changeStatus
)


export const UserRoutes = router;