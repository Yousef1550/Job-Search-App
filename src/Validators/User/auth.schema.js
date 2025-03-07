import Joi from "joi";
import { gendersEnum, otpEnum, systemRoles } from "../../Constants/constants.js";

const today = new Date()
const minValidDate = new Date()
minValidDate.setFullYear(today.getFullYear() - 18)  // age must be => 18

export const signUpSchema = {
    body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
        mobileNumber: Joi.string().required(),
        DOB: Joi.date().required().max(minValidDate).message('Enter a valid DOB, user must be at least 18 years old'),
        gender: Joi.string().valid(gendersEnum.MALE, gendersEnum.FEMALE, gendersEnum.NOT_SPECIFIED),
        role: Joi.string().valid(systemRoles.ADMIN, systemRoles.USER)
    })
}

export const confirmOtpSchema = {
    body: Joi.object({
        email: Joi.string().required().email(),
        otp: Joi.number().required()
    })
}

export const resetOtpSchema = {
    body: Joi.object({
        email: Joi.string().required().email(),
        otpType: Joi.string().valid(otpEnum.CONFIRM_EMAIL, otpEnum.FORGET_PASSWORD).required()
    })
}

export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required()
    })
}


export const sendForgetPasswordOtp_Schema = {
    body: Joi.object({
        email: Joi.string().email().required(),
    })
}


export const resetPasswordSchema  = {
    body: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.number().required(),
        newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required(),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword'))
    })
}