import Joi from "joi";






export const addCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().required(),
        description : Joi.string().required(),
        industry: Joi.string().required(),
        address: Joi.string().required(),
        numberOfEmployees: Joi.number().required().min(10).max(1000),
        companyEmail: Joi.string().email().required(),
        HRs: Joi.alternatives().try(
            Joi.array().items(Joi.string().hex().length(24)), 
            Joi.string().hex().length(24) 
        ).required()
    })
}


export const updateCompanyDataSchema = {
    body: Joi.object({
        companyName: Joi.string(),
        description : Joi.string(),
        industry: Joi.string(),
        address: Joi.string(),
        numberOfEmployees: Joi.number().min(10).max(1000),
        companyEmail: Joi.string().email(),
        HRs: Joi.array().items( Joi.string().hex().length(24) ),
    }),
    params: Joi.object({
        oldCompanyName: Joi.string().required()
    })
}


export const softDeleteCompanySchema = {
    params: Joi.object({
        companyName: Joi.string().required()
    })
}


export const searchForCompanySchema = {
    params: Joi.object({
        companyName: Joi.string().required()
    })
}

export const uploadCompanyLogoSchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}


export const uploadCompanyCoverSchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}


export const deleteLogoSchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}


export const deleteCoverSchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}



export const getCompanyRelatedJobsSchema = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}