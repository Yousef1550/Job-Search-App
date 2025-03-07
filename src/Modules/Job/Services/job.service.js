import { populate } from "dotenv"
import { cloudinary } from "../../../Config/cloudinary.config.js"
import { applicationStatusEnum } from "../../../Constants/constants.js"
import Application from "../../../DB/models/application.model.js"
import Company from "../../../DB/models/company.model.js"
import Job from "../../../DB/models/job-opportunity.model.js"
import { emitter } from "../../../Services/send-email.service.js"
import { HTML_TEMPLATE_Application_Accept, HTML_TEMPLATE_Application_Reject } from "../../../utils/html-template.utils.js"
import { pagination } from "../../../utils/pagination.utils.js"





export const addJobService = async (req, res) => {
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId} = req.body
    const {_id} = req.authUser  // company owner || HR

    const company = await Company.findOne({_id: companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }

    if( company.createdBy.toString() !== _id.toString() && !company.HRs.includes(_id)){
        return res.status(400).json({message: 'You can not perfrom this action'})
    }

    const jobObject = {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel, 
        jobDescription, 
        technicalSkills,
        softSkills, 
        addedBy: _id, 
        companyId
    }
    
    const job = await Job.create(jobObject)
    return res.status(200).json({message: 'Job addedd successfully', job})
}


export const updateJobService = async (req, res) => {
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, closed} = req.body
    const {_id} = req.authUser      // company owner
    const {jobId} = req.params

    const job = await Job.findById(jobId)
    if(!job){
        return res.status(404).json({message: 'Job not found'})
    }

    const company = await Company.findOne({_id: job.companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }

    if(company.createdBy.toString() !== _id.toString()){
        return res.status(400).json({message: 'You can not perfrom this action'})
    }

    const updatedJob = await Job.findOneAndUpdate({_id: job._id},
        { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, closed, updatedBy: _id },
        {new: true}
    )
    return res.status(200).json({message: 'Job updated successfully', updatedJob})
} 



export const deleteJobService = async (req, res) => {
    const {_id} = req.authUser  // company HR
    const {jobId} = req.params

    const job = await Job.findById(jobId)
    if(!job){
        return res.status(404).json({message: 'Job not found'})
    }

    const company = await Company.findOne({_id: job.companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }

    if(!company.HRs.includes(_id)){
        return res.status(400).json({message: 'You can not perfrom this action'})
    }
    await Job.deleteOne({_id: jobId})
    return res.status(200).json({message: 'Job deleted successfully'})
}


export const getCompanyJobs = async (req, res) => {
    const {companyName, jobTitle} = req.params
    const {page, limit} = req.query     


    const company = await Company.findOne({companyName, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }
    
    if(jobTitle){
        const job = await Job.find({companyId: company._id, jobTitle})      // all jobs with a specific jobTitle
        if(!job){
            return res.status(404).json({message: 'Job not found'})
        }
        return res.status(200).json({message: 'Job fetched successfully', job})
    }

    const jobs = await Job.paginate(
        {companyId: company._id},
        {
            page,
            limit,
            sort: { createdAt: -1 }
        }
    )
    if(!jobs){
        return res.status(404).json({message: 'Job not found'})
    }
    return res.status(200).json({message: 'Jobs fetched successfully', jobs})
}


export const getAllFilteredJobs = async (req, res) => {
    let {workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, page, limit} = req.query

    const filtersObject = {}

    if(workingTime){
        filtersObject.workingTime = workingTime
    }
    if(jobLocation){
        filtersObject.jobLocation = jobLocation
    }
    if(seniorityLevel){
        filtersObject.seniorityLevel = seniorityLevel
    }
    if(jobTitle){
        filtersObject.jobTitle = jobTitle
    }
    if(technicalSkills){
        if(typeof(technicalSkills) === 'string'){
            technicalSkills = [technicalSkills]
        }
        filtersObject.technicalSkills = technicalSkills
    }

    if(Object.values(filtersObject).length === 0){
        const jobs = await Job.paginate(
            {},
            {
                page,
                limit,
                sort: { createdAt: -1 }
            }
        )
    }

    const jobs = await Job.paginate(
        filtersObject,
        {
            page,
            limit,
            sort: { createdAt: -1 }
        }
    )
    return res.status(200).json({message: 'Jobs fetched successfully', jobs})
}



export const applyToJob = async (req, res) => {
    const {_id} = req.authUser
    const {jobId} = req.body
    const {file} = req

    if(!file){
        return res.status(400).json({message: 'CV required'})
    }
    
    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Job_Application/CV`
        }
    )

    const job = await Job.findOne({_id: jobId, deletedAt: null, bannedAt: null})
    if(!job){
        return res.status(404).json({message: 'Job not found'})
    }
    // job.addedBy => HR

    const applicationObject = {
        userId: _id,
        jobId,
        userCV: {secure_url, public_id}
    }

    const application = await Application.create(applicationObject)
    
    return res.status(200).json({message: 'Job applied successfully', application})
}




export const acceptOrRejectApplicant = async (req, res) => {
    const {applicationId} = req.params
    let {isAccepted} = req.query
    const {_id} = req.authUser
    
    if(isAccepted === 'true')   isAccepted = true
    if(isAccepted === 'false')  isAccepted = false
    
    
    const application = await Application.findOne({_id: applicationId, status: applicationStatusEnum.PENDING}).populate(
        [
            {
                path: 'jobId',
                select: 'jobTitle addedBy -_id'
            },
            {
                path: 'userId',
                select: 'email firstName lastName'
            }
        ]
    )
    if(!application){
        return res.status(404).json({message: 'Application not found'})
    }
    
    // jobId.addedBy
    if(application.jobId.addedBy.toString() !== _id.toString()){
        return res.status(400).json({message: 'Unauthorized, only the job HR can perform this action'})
    }

    if(isAccepted){
        application.status = applicationStatusEnum.ACCEPTED

        emitter.emit('sendEmail', {
            to: application.userId.email,
            subject: 'Job Application Status',
            html: HTML_TEMPLATE_Application_Accept(`${application.userId.firstName} ${application.userId.lastName}`)
        })
        await application.save()
        return res.status(200).json({message: 'Application accepted', application})
    }

    if(!isAccepted){
        application.status = applicationStatusEnum.REJECTED

        emitter.emit('sendEmail', {
            to: application.userId.email,
            subject: 'Job Application Status',
            html: HTML_TEMPLATE_Application_Reject(`${application.userId.firstName} ${application.userId.lastName}`)
        })
        await application.save()
        return res.status(200).json({message: 'Application rejected', application})
    }
}




export const getAllJobApplications = async (req, res) => {
    const {_id} = req.authUser
    const {jobId} = req.params
    const {page, limiter} = req.query

    const {limit, skip} = pagination(page, limiter)
    
    const job = await Job.findOne({_id: jobId, closed: false}).populate(
        [
            {
                path: 'Applications',       // virtual populate
                options: {skip, limit, sort: {createdAt: -1}},
                populate: [
                    {
                        path: 'userId',
                        select: '-_id -password'
                    }
                ]
            },
            {
                path: 'companyId'
            }
        ]
)
    if(!job){
        return res.status(404).json({message: 'Job not found'})
    }
    
    if(_id.toString() !== job.companyId.createdBy.toString() && !job.companyId.HRs.includes(_id)){
        return res.status(400).json({message: 'Unauthorized, only the company HR and owner can perform this action'})
    }

    const totalDocs = await Application.countDocuments({jobId})
    return res.status(200).json({message: 'Job applications fetched successfully', job, totalDocs, page: Number(page)})

}