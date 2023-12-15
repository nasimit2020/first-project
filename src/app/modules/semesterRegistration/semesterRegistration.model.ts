import { Schema, model } from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interfact";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({

})

export const SemesterRegistration = model<TSemesterRegistration>('SemesterRegistration', semesterRegistrationSchema)