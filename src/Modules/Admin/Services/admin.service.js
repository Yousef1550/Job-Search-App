import { systemRoles } from "../../../Constants/constants.js"
import Company from "../../../DB/models/company.model.js"
import User from "../../../DB/models/user.model.js"






export const banOrUnbanUserService = async (req, res) => {
    const {userId} = req.params

    const user = await User.findOne({_id: userId, role: systemRoles.USER})
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }
    
    if(user.bannedAt){
        await User.updateOne({_id: user._id}, {$unset: { bannedAt: ''}})
        return res.status(200).json({message: 'User unbanned successfully'})
    }
    user.bannedAt = new Date()
    await user.save()

    return res.status(200).json({message: 'User banned successfully'})
}



export const banOrUnbanCompanyService = async (req, res) => {
    const {companyId} = req.params

    const company = await Company.findByIdAndUpdate(companyId, {bannedAt: new Date()})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }
    if(company.bannedAt){
        await Company.updateOne({_id: companyId}, {$unset: {bannedAt: ''}})
        return res.status(200).json({message: 'Company unbanned successfully'})
    }
    return res.status(200).json({message: 'Company banned successfully'})
}



export const approveCompanyService = async (req, res) => {
    const {companyId} = req.params

    const company = await Company.findOneAndUpdate({_id: companyId, approvedByAdmin: null}, {approvedByAdmin: true})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }
    return res.status(200).json({message: 'Company aprroved successfully'})
}