import Joi from "joi";
import { applicationStatusEnum, jobLocationEnum, seniorityLevelEnum, WorkingTimeEnum } from "../../Constants/constants.js";





export const addJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().required(),
        jobLocation: Joi.string().valid(jobLocationEnum.HYBRID, jobLocationEnum.ONSITE, jobLocationEnum.REMOTELY).required(),
        workingTime: Joi.string().valid(WorkingTimeEnum.FULL_TIME, WorkingTimeEnum.PART_TIME).required(),
        seniorityLevel: Joi.string().valid(seniorityLevelEnum.CTO, seniorityLevelEnum.FRESH, seniorityLevelEnum.JUNIOR, seniorityLevelEnum.MID_LEVEL, seniorityLevelEnum.SENIOR, seniorityLevelEnum.TEAM_LEAD), 

        jobDescription: Joi.string().required(), 
        technicalSkills: Joi.array().items(Joi.string()) ,
        softSkills: Joi.array().items(Joi.string()) , 
        companyId: Joi.string().hex().length(24).required()
    })
}


export const updateJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string(),
        jobLocation: Joi.string().valid(jobLocationEnum.HYBRID, jobLocationEnum.ONSITE, jobLocationEnum.REMOTELY),
        workingTime: Joi.string().valid(WorkingTimeEnum.FULL_TIME, WorkingTimeEnum.PART_TIME),
        seniorityLevel: Joi.string().valid(seniorityLevelEnum.CTO, seniorityLevelEnum.FRESH, seniorityLevelEnum.JUNIOR, seniorityLevelEnum.MID_LEVEL, seniorityLevelEnum.SENIOR, seniorityLevelEnum.TEAM_LEAD), 

        jobDescription: Joi.string(), 
        technicalSkills: Joi.array().items(Joi.string()) ,
        softSkills: Joi.array().items(Joi.string()),
        closed: Joi.boolean()
    }),

    params: Joi.object({
        jobId: Joi.string().hex().length(24).required()
    })
}


export const deleteJobSchema = {
    params: Joi.object({
        jobId: Joi.string().hex().length(24).required()
    })
}



export const getCompanyJobsSchema = {
    params: Joi.object({
        jobTitle: Joi.string(),
        companyName: Joi.string().required()
    }),
    query: Joi.object({
        page: Joi.number().required(), 
        limit: Joi.number().required()
    })
}


export const getAllFilteredJobsSchema = {
    query: Joi.object({
        workingTime: Joi.string().valid(WorkingTimeEnum.FULL_TIME, WorkingTimeEnum.PART_TIME),
        jobLocation: Joi.string().valid(jobLocationEnum.HYBRID, jobLocationEnum.ONSITE, jobLocationEnum.REMOTELY), 
        seniorityLevel: Joi.string().valid(seniorityLevelEnum.CTO, seniorityLevelEnum.FRESH, seniorityLevelEnum.JUNIOR, seniorityLevelEnum.MID_LEVEL, seniorityLevelEnum.SENIOR, seniorityLevelEnum.TEAM_LEAD),

        jobTitle: Joi.string(), 
        technicalSkills: Joi.alternatives().try(
            Joi.array().items(Joi.string()), 
            Joi.string() 
        ), 

        page: Joi.number().required(), 
        limit: Joi.number().required()
    })
}




export const applyToJobSchema = {
    body: Joi.object({
        jobId: Joi.string().hex().length(24).required()
    })
}


export const acceptOrRejectApplicantSchema = {
    query: Joi.object({
        isAccepted: Joi.bool().required()
    }),
    params: Joi.object({
        applicationId: Joi.string().hex().length(24).required()
    })
}

export const getAllJobApplicationsSchema = {
    params: Joi.object({
        jobId: Joi.string().hex().length(24).required()
    }),
    query: Joi.object({
        page: Joi.number().required(), 
        limiter: Joi.number().required()
    })
}

