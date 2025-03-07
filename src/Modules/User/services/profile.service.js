import { compareSync } from "bcrypt"
import User from "../../../DB/models/user.model.js"
import { cloudinary } from "../../../Config/cloudinary.config.js"




export const updateUserProfile = async (req, res) => {
    const {_id} = req.authUser
    const {mobileNumber, DOB, firstName, lastName, gender} = req.body

    const user = await User.findById(_id)
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up'})
    }

    if(firstName){
        user.firstName = firstName
    }
    if(lastName){
        user.lastName = lastName
    }
    if(gender){
        user.gender = gender
    }
    if(DOB){
        user.DOB = DOB
    }
    if(mobileNumber){
        user.mobileNumber = mobileNumber
    }
    user.updatedBy = _id
    await user.save()
    return res.status(200).json({message: 'User data updated successfully'})
}


export const getUserAccountData = async (req, res) => {
    const {_id} = req.authUser

    const user = await User.findById(_id).select(
        '-role -isConfirmed -OTP -createdAt -updatedAt -__v -changeCredentialTime -password -provider'
    )
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up'})
    }
    return res.status(200).json({message: 'User data fetched successfully', user})
}





export const getProfileDataForAnotherUserService = async (req, res) => {
    const {_id} = req.params  // another user _id

    const anotherUser = await User.findOne({_id, deletedAt: null, bannedAt: null}).select(
        'mobileNumber userName firstName lastName profilePic coverPic'
    )
    if(!anotherUser){
        return res.status(404).json({message: 'User not found'})
    }
    return res.status(200).json({message: 'User data fetched successfully', anotherUser})
}


export const updatePasswordService = async (req, res, next) => {
    const {_id} = req.authUser
    const {password, newPassword, confirmNewPassword} = req.body

    if(newPassword !== confirmNewPassword){
        return res.status(409).json({message: 'New password and confirm new password does not match'})
    }
    if(newPassword === password){
        return res.status(409).json({message: 'New password should be different from the old password'})
    }
    const user = await User.findById(_id)

    const isPasswordMatched = compareSync(password, user.password)
    if(!isPasswordMatched){
        return res.status(409).json({message: 'Invalid password'})
    }
    user.password = newPassword
    user.changeCredentialTime = new Date()
    await user.save()
    req.passwordUpdated = true
    next()
}





export const softDeleteUserAccountService = async (req, res) => {
    const {_id} = req.authUser

    const user = await User.findOneAndUpdate({_id, deletedAt: null}, {deletedAt: new Date()})
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }
    return res.status(200).json({message: 'User account soft deleted successfully'})
}



export const uploadProfilePicService = async (req, res) => {
    const {_id, profilePic} = req.authUser
    const {file} = req
    
    if(!file){
        return res.status(400).json({message: 'Profile picture required'})
    }
    
    if(profilePic && Object.values(profilePic).length > 0){
        await cloudinary().uploader.destroy(profilePic.public_id)   // to replace the old photo on cloudinary
    }

    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Profile`,
            resource_type: 'image'
        }
    )
    const user = await User.findByIdAndUpdate(_id, {
        profilePic: {secure_url, public_id}},
        {new: true}
    )
    return res.status(200).json({message: 'User profile picture uploaded successfully', user})
}


export const uploadCoverPicService = async (req, res) => {
    const {_id, coverPic} = req.authUser
    const {file} = req

    if(!file){
        return res.status(400).json({message: 'Cover picture required'})
    }
    if(coverPic && Object.values(coverPic).length > 0){
        await cloudinary().uploader.destroy(coverPic.public_id)
    }

    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Cover`,
            resource_type: 'image'
        }
    )
    const user = await User.findByIdAndUpdate(_id, {
        coverPic: {secure_url, public_id}},
        {new: true}
    )
    return res.status(200).json({message: 'User cover picture uploaded successfully', user})
}


export const deleteProfilePic = async (req, res) => {
    const {_id, profilePic} = req.authUser

    if(Object.values(profilePic).length === 0){
        return res.status(400).json({message: 'User profile pic already deleted'})
    }
    
    const user = await User.findByIdAndUpdate(_id, {$unset: {profilePic: ''}})
    
    const ProfilePicPublic_Id = user.profilePic.public_id
    await cloudinary().uploader.destroy(ProfilePicPublic_Id)
    return res.status(200).json({message: 'User profile pic deleted successfully'})
}


export const deleteCoverPic = async (req, res) => {
    const {_id, coverPic} = req.authUser

    if(Object.values(coverPic).length === 0){
        return res.status(400).json({message: 'User cover pic already deleted'})
    }
    
    const user = await User.findByIdAndUpdate(_id, {$unset: {coverPic: ''}})

    const coverPicPublic_Id = user.coverPic.public_id
    await cloudinary().uploader.destroy(coverPicPublic_Id)
    return res.status(200).json({message: 'User cover pic deleted successfully'})
}