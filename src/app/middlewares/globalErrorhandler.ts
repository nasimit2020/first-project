/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    //setting default values
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong';



    let errorSources: TErrorSource = [{
        path: '',
        message: 'Something went wrong'
    }]

    const handleZodError = (error: ZodError) => {
        const errorSources: TErrorSource = error.issues.map((issue: ZodIssue) => {
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue?.message,
            }
        })
        const statusCode = 400;
        return {
            statusCode,
            message: 'Validation Error',
            errorSources
        }
    }

    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error)
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }



    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? error?.stack : null,
        // err: error
    })
}

export default globalErrorHandler;