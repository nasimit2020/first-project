/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

// application routes
app.use('/api/v1/', router);

// const test = async (req: Request, res: Response) => {
//   const a = 100
//   res.sendStatus(a);
// };

// app.get('/', test);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
