import Joi from "joi";



export const banOrUnbanUserSchema = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required()
    })
}


export const banOrUnbanCompanySchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}


export const approveCompanySchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}