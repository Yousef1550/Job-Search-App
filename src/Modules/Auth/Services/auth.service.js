import { compareSync, hashSync } from "bcrypt"
import User from "../../../DB/models/user.model.js"
import { emitter } from "../../../Services/send-email.service.js"
import { HTML_TEMPLATE_confirmEmail, HTML_TEMPLATE_forgetPassword } from "../../../utils/html-template.utils.js"
import { otpEnum } from "../../../Constants/constants.js"
import { signToken, verifyToken } from "../../../utils/jwt.utils.js"
import { v4 as uuidv4 } from 'uuid';
import BlackListTokens from "../../../DB/models/black-list-tokens.model.js"






export const signUpService = async (req, res) => {
    const {firstName, lastName, email, password, confirmPassword, mobileNumber, DOB, gender, role} = req.body

    if(password !== confirmPassword){
        return res.status(409).json({message: 'Password and confirm password does not match'})
    }

    const isEmailExist = await User.findOne({email})
    if(isEmailExist){
        return res.status(409).json({message: 'Email already exists'})
    }

    const confirmOtp = Math.floor(Math.random() * 10000)
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000)      // 10 min
    const hashedOtp = hashSync(confirmOtp.toString(), +process.env.SALT_ROUNDS)

    emitter.emit('sendEmail', ({
        to: email,
        subject: 'Verify your email',
        html: HTML_TEMPLATE_confirmEmail(confirmOtp)
    }))
    
    const user = await User.create(
        {
            firstName,                                              
            lastName,
            email,
            password,
            mobileNumber,
            DOB,
            gender,
            role,
            OTP: [{
                code: hashedOtp,
                otpType: otpEnum.CONFIRM_EMAIL,
                expiresIn
            }]
        }
    )
    if(!user){
        return res.status(409).json({message: 'Something went wrong, please try again later'})
    }

    return res.status(200).json({message: 'User created successfully', user})
}



export const confirmOtpService = async (req, res) => {
    const {otp, email} = req.body
    
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up first'})
    }
    const confirmEmail_OTP = user.OTP.filter(otp => otp.otpType === otpEnum.CONFIRM_EMAIL)   // array of confirmEmail OTPs objects     
    if(!confirmEmail_OTP){
        return res.status(404).json({message: 'OTP not found'})
    }

    const lastSentOtp = confirmEmail_OTP[confirmEmail_OTP.length - 1]

    if(new Date(lastSentOtp.expiresIn) < new Date()){
        return res.status(400).json({message: 'OTP expired'})
    }

    const isOtpValid = compareSync(otp.toString(), lastSentOtp.code.toString())
    if(!isOtpValid){
        return res.status(400).json({message: 'Invalid OTP'})
    }
    user.isConfirmed = true
    await user.save()
    return res.status(200).json({message: 'User email verified successfully'})
}



export const resetOtpService = async (req, res) => {
    const {email, otpType} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up first'})
    }
    const confirmOtp = Math.floor(Math.random() * 10000)
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000)      // 10 min
    const hashedOtp = hashSync(confirmOtp.toString(), +process.env.SALT_ROUNDS)

    if(otpType === otpEnum.CONFIRM_EMAIL){
            emitter.emit('sendEmail', {
            to: email,
            subject: 'Verify your email',
            html: HTML_TEMPLATE_confirmEmail(confirmOtp)
        })
    }else if (otpType === otpEnum.FORGET_PASSWORD){
            emitter.emit('sendEmail', {
            to: email,
            subject: 'Verify your email',
            html: HTML_TEMPLATE_forgetPassword(confirmOtp)
        })
    }
    user.OTP.push(
        {
            code: hashedOtp,
            otpType,
            expiresIn
        }
    )
    await user.save()
    return res.status(200).json({message: 'OTP reseted successfully'})
}



export const signInService = async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})    // check email
    if(!user){
        return res.status(404).json({message: 'Invalid credentials'})
    }
    if(user.bannedAt || user.deletedAt){
        return res.status(400).json({message: 'User Can not sign in, Account is freezed'})
    }
    const isPasswordMatched = compareSync(password, user.password)      // check password
    if(!isPasswordMatched){
        return res.status(409).json({message: 'Invalid credentials'})
    }

    const accesstoken = signToken(
        {
            data: {_id: user._id, email: user.email},
            secretKey: process.env.SECRET_KEY_ACCESS,
            options: {expiresIn: process.env.ACCESS_EXPIRATION_TIME, jwtid: uuidv4()}
        }
    )

    const refreshtoken = signToken(
        {
            data: {_id: user._id, email: user.email},
            secretKey: process.env.SECRET_KEY_REFRESH,
            options: {expiresIn: process.env.REFRESH_EXPIRATION_TIME, jwtid: uuidv4()}
        }
    )
    return res.status(200).json({message: 'User logged in successfully', accesstoken, refreshtoken})
}



export const sendForgetPasswordOtpService = async (req, res) => {
    const {email} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up first'})
    }

    const confirmOtp = Math.floor(Math.random() * 10000)
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000)      // 10 min
    const hashedOtp = hashSync(confirmOtp.toString(), +process.env.SALT_ROUNDS)

    emitter.emit('sendEmail', {
        to: email,
        subject: 'Reset your password',
        html: HTML_TEMPLATE_forgetPassword(confirmOtp)
    })

    user.OTP.push(
        {
            code: hashedOtp,
            otpType: otpEnum.FORGET_PASSWORD,
            expiresIn
        }
    ) 
    await user.save()
    return res.status(200).json({message: 'Forget Password OTP sent successfully'})
}


export const resetPasswordService = async (req, res) => {
    const {email, otp, newPassword, confirmNewPassword} = req.body
    
    if(newPassword !== confirmNewPassword){
        return res.status(409).json({message: 'New password and confirm new password does not match'})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up first'})
    }
    if(newPassword === user.password){
        return res.status(409).json({message: 'New password should be different from the old password'})
    }
    const forgetPassword_OTP = user.OTP.filter(otp => otp.otpType === otpEnum.FORGET_PASSWORD)    // array of forgetPassword OTPs objects     
    if(!forgetPassword_OTP){
        return res.status(404).json({message: 'OTP not found'})
    }

    const lastSentOtp = forgetPassword_OTP[forgetPassword_OTP.length - 1]

    if(new Date(lastSentOtp.expiresIn) < new Date()){
        return res.status(400).json({message: 'OTP expired'})
    }

    const isOtpValid = compareSync(otp.toString(), lastSentOtp.code.toString())
    if(!isOtpValid){
        return res.status(400).json({message: 'Invalid OTP'})
    }
    user.password = newPassword
    user.changeCredentialTime = new Date()
    await user.save()
    return res.status(200).json({message: 'Password changed successfully'})
}



export const signOutService = async (req, res) => {
    const {token} = req.authUser
    const {refreshToken, passwordUpdated} = req
    
    await BlackListTokens.insertMany(
        [
            {
                tokenId: token.tokenId,
                expiryDate: token.expiryDate
            },
            {
                tokenId: refreshToken.tokenId,
                expiryDate: refreshToken.expiryDate
            }
        ]
    )
    // check if this service is used after updatePasswordService
    if(passwordUpdated){
        return res.status(200).json({message: 'Password changed successfully, please sign in again'})
    }
    return res.status(200).json({message: 'User logged out successfully'})
}



export const refreshTokenService = async (req, res) => {
    const {refreshToken} = req
    const user = await User.findById(refreshToken._id)
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up first'})
    }
    // check if the credentials was changed after the refresh token created
    if(new Date(user.changeCredentialTime) > new Date(refreshToken.iat * 1000)){    
        return res.status(404).json({message: 'Your credentials have changed. Please sign in again'})
    }
    const accesstoken = signToken(
        {
            data: {_id: refreshToken._id, email: refreshToken.email},
            secretKey: process.env.SECRET_KEY_ACCESS,
            options: {expiresIn: process.env.ACCESS_EXPIRATION_TIME, jwtid: uuidv4()}
        }
    )
    return res.status(200).json({message: 'Token refreshed successfully', accesstoken})
}