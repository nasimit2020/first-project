import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload?.academicSemester;

    //check if there any registered semester thai is already 'UPCOMING' | 'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }],
    });

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already a ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`)
    }

    // check if the academic semester is exist

    const isAcademicSemesterExist = await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'This academic semester not found')

    }

    // check if the semester is already registered!
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester });
    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.CONFLICT, 'This Semester is already registered');
    }

    const result = await SemesterRegistration.create(payload);
    return result;
}

const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields();

    const result = await semesterRegistrationQuery.modelQuery;
    const meta = await semesterRegistrationQuery.countTotal();
    return { meta, result };
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id).populate('academicSemester');
    return result
}

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    //check if the requested registered semester is exists
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found')
    }
    // if the requested semester registration is ended, we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists?.status;
    const requestedSemesterStatus = payload?.status;

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`)
    }

    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status ${currentSemesterStatus} to ${requestedSemesterStatus}`)
    }

    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedSemesterStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status ${currentSemesterStatus} to ${requestedSemesterStatus}`)
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

    return result;
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
}