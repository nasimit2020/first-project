import { SemesterRegistrationRoutes } from './../modules/semesterRegistration/semesterRegistration.route';
import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourserRouters } from "../modules/course/course.route";
import { offeredCourseRouter } from '../modules/offeredCourse/offeredCourse.route';
import { AuthRouter } from '../modules/auth/auth.route';


const router = Router()

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/students',
        route: StudentRoutes
    },
    {
        path: '/faculty',
        route: FacultyRoutes
    },
    {
        path: '/admins',
        route: AdminRoutes
    },
    {
        path: '/academic-semester',
        route: AcademicSemesterRoutes
    },
    {
        path: '/academic-faculties',
        route: AcademicFacultyRoutes
    },
    {
        path: '/academic-departments',
        route: AcademicDepartmentRoutes
    },
    {
        path: '/courses',
        route: CourserRouters
    },
    {
        path: '/semester-registration',
        route: SemesterRegistrationRoutes
    },
    {
        path: '/offered-courses',
        route: offeredCourseRouter
    },
    {
        path: '/auth',
        route: AuthRouter
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route));


export default router;