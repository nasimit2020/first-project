import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service"


const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculty is Created successfully!',
        data: result
    })
});

const getAllAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Academic Faculty find successfully!',
        data: result,
    })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Academic Faculty retrieved',
        data: result,
    })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(facultyId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Faculty updated successfully!",
        data: result,
    })
})


export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}