import { cloudinary } from "../../../Config/cloudinary.config.js"
import { systemRoles } from "../../../Constants/constants.js"
import Company from "../../../DB/models/company.model.js"
import User from "../../../DB/models/user.model.js"





export const addCompanyService = async (req, res) => {
    let {companyName, description, industry, address, numberOfEmployees, companyEmail, HRs} = req.body
    const {_id} = req.authUser
    const {file} = req

    const isCompanyExists = await Company.findOne({companyName, companyEmail})
    if(isCompanyExists){
        return res.status(409).json({message: 'Company name or email already exists'})
    }
    const companyObject = {            
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy: _id
    }

    if(HRs){
        if(typeof(HRs) === 'string'){
            HRs = [HRs]
        }
        const users = await User.find({_id: {$in: HRs}, deletedAt: null, bannedAt: null})
        if(HRs.length !== users.length){
            return res.status(400).json({message: 'Invalid HRs ids'})
        }
        companyObject.HRs = HRs
    }

    if(file){
        const {secure_url, public_id} = await cloudinary().uploader.upload(file.path, 
            {
                folder: `${process.env.CLOUDINARY_FOLDER}/Company/Legal_Attachment`
            }
        )
        companyObject.legalAttachment = {secure_url, public_id}
    }
    const company = await Company.create(companyObject)
    return res.status(200).json({message: 'Company created successfully', company})
}




export const updateCompanyDataService = async (req, res) => {
    const {companyName, description, industry, address, numberOfEmployees, companyEmail, HRs} = req.body    // new data
    const {oldCompanyName} = req.params
    const {_id} = req.authUser

    const company = await Company.findOne({companyName: oldCompanyName, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(400).json({message: 'Company does not exist'})
    }
    
    if(company.createdBy.toString() !== _id.toString()){
        return res.status(400).json({message: 'You can not perform this action, only the company owner can update the company data'})
    }

    if(companyName){
        const isCompanyNameExist = await Company.findOne({companyName})
        if(isCompanyNameExist){
            return res.status(400).json({message: 'Name already exist'})
        }
        company.companyName = companyName
    }
    if(description){
        company.description = description
    }
    if(industry){
        company.industry = industry
    }
    if(address){
        company.address = address
    }
    if(numberOfEmployees){
        company.numberOfEmployees = numberOfEmployees
    }
    if(companyEmail){
        const isCompanyEmailExist = await Company.findOne({companyEmail})
        if(isCompanyEmailExist){
            return res.status(400).json({message: 'Email already exist'})
        }
        company.companyEmail = companyEmail
    }

    if(HRs){
        const users = await User.find({_id: {$in: HRs}, deletedAt: null, bannedAt: null})
        if(users.length !== HRs.length){
            return res.status(400).json({message: 'Invalid HRs ids'})
        }
        for (const HR of HRs) {
            if(company.HRs.includes(HR)){
                return res.status(400).json({message: 'HR already added'})
            }
            company.HRs.push(HR)
        }
    }

    await company.save()
    return res.status(200).json({message: 'Company data updated successfully', company})
}



export const softDeleteCompanyService = async (req, res) => {
    const {companyName} = req.params
    const {_id, role} = req.authUser

    const company = await Company.findOne({companyName, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(400).json({message: 'Company does not exist'})
    }

    if(company.createdBy.toString() !== _id.toString() && role !== systemRoles.ADMIN){
        return res.status(400).json({message: 'You can not perform this action, only the company owner or admins can delete the company'})
    }
    company.deletedAt = new Date()
    await company.save()
    return res.status(200).json({message: 'Company soft deleted successfully'})
}


export const searchForCompanyService = async (req, res) => {
    const {companyName} = req.params

    const company = await Company.findOne({companyName, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company does not exist'})
    }
    return res.status(200).json({message: 'Company data fetched successfully', company})
}




export const uploadCompanyLogoService = async (req, res) => {
    const {_id} = req.authUser
    const {file} = req
    const {companyId} = req.params

    if(!file){
        return res.status(400).json({message: 'Logo required'})
    }

    const company = await Company.findOne({_id: companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company does not exist'})
    }
    
    const {logo, createdBy} = company

    if(_id.toString() !== createdBy.toString()){
        return res.status(400).json({message: 'You can not perform this action'})
    }
    
    if(logo && logo.secure_url){
        await cloudinary().uploader.destroy(logo.public_id)   
    }

    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Company/Logo`,
            resource_type: 'image'
        }
    )
    company.logo = {secure_url, public_id}
    await company.save()
    return res.status(200).json({message: 'Company logo uploaded successfully', company})
}


export const uploadCompanyCoverService = async (req, res) => {
    const {_id} = req.authUser
    const {file} = req
    const {companyId} = req.params

    if(!file){
        return res.status(400).json({message: 'Cover required'})
    }

    const company = await Company.findOne({_id: companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company does not exist'})
    }
    
    const {coverPic, createdBy} = company
    
    if(_id.toString() !== createdBy.toString()){
        return res.status(400).json({message: 'You can not perform this action'})
    }
    
    if(coverPic && coverPic.secure_url){
        await cloudinary().uploader.destroy(coverPic.public_id)   
    }

    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Company/Cover`,
            resource_type: 'image'
        }
    )
    company.coverPic = {secure_url, public_id}
    await company.save()
    return res.status(200).json({message: 'Company logo uploaded successfully', company})
}


export const deleteLogoService = async (req, res) => {
    const {_id} = req.authUser
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company does not exist'})
    }
    const {logo, createdBy} = company

    if(_id.toString() !== createdBy.toString()){
        return res.status(400).json({message: 'You can not perform this action'})
    }

    if(!logo.secure_url){
        return res.status(400).json({message: 'company logo already deleted'})  
    }

    await Company.findByIdAndUpdate(companyId, {$unset: {logo: ''}})

    await cloudinary().uploader.destroy(logo.public_id)
    return res.status(200).json({message: 'Company logo deleted successfully'})
}

export const deleteCoverService = async (req, res) => {
    const {_id} = req.authUser
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company does not exist'})
    }
    const {coverPic, createdBy} = company

    if(_id.toString() !== createdBy.toString()){
        return res.status(400).json({message: 'You can not perform this action'})
    }

    if(!coverPic.secure_url){
        return res.status(400).json({message: 'company cover already deleted'})  
    }

    await Company.findByIdAndUpdate(companyId, {$unset: {coverPic: ''}})

    await cloudinary().uploader.destroy(coverPic.public_id)
    return res.status(200).json({message: 'Company cover deleted successfully'})
}



export const getCompanyJobs = async (req, res) => {
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId, deletedAt: null, bannedAt: null}).populate(
        [
            {
                path: 'Jobs'
            }
        ]
    )
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }
    return res.status(200).json({message: 'Company jobs fetched successfully', company})
}