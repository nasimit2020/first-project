import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
// import AppError from "../../errors/AppError";

const createStudent = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(req.file, password, studentData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created successfully',
        data: result
    })
});


const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;
    const result = await UserServices.createFacultyIntoDB(req.file, password, facultyData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is created successfully',
        data: result,
    })
})

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;
    const result = await UserServices.createAdminIntoDB(req.file, password, adminData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin is created successfully',
        data: result,
    })
})

const getMe = catchAsync(async (req, res) => {
    // const token = req.headers.authorization
    // if (!token) {
    //     throw new AppError(httpStatus.NOT_FOUND, 'Token not found')
    // }
    const { userId, role } = req.user;
    const result = await UserServices.getMeFromDB(userId, role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Your data is retrieved successfully',
        data: result,
    })
})

const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await UserServices.changeUserStatusIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status change successfully',
        data: result,
    })
})


export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus
}