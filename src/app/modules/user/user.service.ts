import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";


const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    // Create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, use default password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student'

    // set manually generated id
    userData.id = '2030100002';

    //create a user
    const newUser = await User.create(userData);

    // Create a student
    if (Object.keys(newUser).length) {
        // set id, _id as user
        studentData.id = newUser.id;
        studentData.user = newUser._id;

        const newStudent = await Student.create(studentData)
        return newStudent;
    }

};

export const UserServices = {
    createStudentIntoDB
}