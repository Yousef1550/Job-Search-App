import Joi from "joi";
import { gendersEnum } from "../../Constants/constants.js";

const today = new Date()
const minValidDate = new Date()
minValidDate.setFullYear(today.getFullYear() - 18)  // age must be => 18

export const updateAccountSchema = {
    body: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        mobileNumber: Joi.string(),
        DOB: Joi.date().max(minValidDate).message('Enter a valid DOB, user must be at least 18 years old'),
        gender: Joi.string().valid(gendersEnum.MALE, gendersEnum.FEMALE, gendersEnum.NOT_SPECIFIED),
    })
}


export const getProfileDataForAnotherUserSchema = {
    params: Joi.object({
        _id: Joi.string().hex().length(24).required()
    })
}


export const updatePasswordSchema = {
    body: Joi.object({
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required(),
        newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required(),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword'))
    })
}