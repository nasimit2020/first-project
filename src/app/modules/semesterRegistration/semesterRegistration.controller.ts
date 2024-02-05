import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester registration successfully',
        data: result
    })
})

const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All semester register is retrieved successfully',
        meta: result.meta,
        data: result.result,
    })
})

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: ' Semester is retrieved successfully',
        data: result
    })

})

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: ' Semester update successfully',
        data: result
    })

})

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration
}