/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1/', router);

const rest = (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/', rest);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);



//Not Found
app.use(notFound);

export default app;
