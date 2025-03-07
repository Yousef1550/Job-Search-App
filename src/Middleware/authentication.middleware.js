import BlackListTokens from "../DB/models/black-list-tokens.model.js"
import User from "../DB/models/user.model.js"
import { verifyToken } from "../utils/jwt.utils.js"


export const validateUserToken = async (accesstoken) => {
    if(!accesstoken){
        return 'Access tohen required, please login'
    }

    const decodedData = verifyToken({token: accesstoken, secretKey: process.env.SECRET_KEY_ACCESS})

    const isTokenBlackListed = await BlackListTokens.findOne({tokenId: decodedData.jti})
    if(isTokenBlackListed){
        return 'Access token is blacklisted, please login'
    }

    const user = await User.findById(decodedData._id, '-password -__v')
    if(!user){
        return 'User not found, please signUp'
    }

    
    return {
            ...user._doc,
            token: {
            tokenId: decodedData.jti,
            expiryDate: decodedData.exp
        }
    }
    
}



export const authenticationMiddleware = () => {
    return async (req, res, next) => {
        const {accesstoken} = req.headers

        if(!accesstoken){
            return res.status(400).json({message: 'Access tohen required, please login'})
        }

        const decodedData = verifyToken({token: accesstoken, secretKey: process.env.SECRET_KEY_ACCESS})

        const isTokenBlackListed = await BlackListTokens.findOne({tokenId: decodedData.jti})
        if(isTokenBlackListed){
            return res.status(401).json({message: 'Access token is blacklisted, please login'})
        }

        const user = await User.findById(decodedData._id, '-password -__v')
        if(!user){
            return res.status(404).json({message: 'User not found, please sign Up'})
        }

        req.authUser = {
            ...user._doc,
            token: {
                tokenId: decodedData.jti,
                expiryDate: decodedData.exp
            }
        }
        next()
    }
}



export const checkRefreshToken = () => {
    return async (req, res, next) => {
        const {refreshtoken} = req.headers
        if(!refreshtoken){
            return res.status(400).json({message: 'Refresh tohen required, please login'})
        }

        const decodedData = verifyToken({token: refreshtoken, secretKey: process.env.SECRET_KEY_REFRESH})
        
        const isTokenBlackListed = await BlackListTokens.findOne({tokenId: decodedData.jti})
        if(isTokenBlackListed){
            return res.status(401).json({message: 'Refresh token is blacklisted, please login'})
        }

        req.refreshToken = {
            tokenId: decodedData.jti,
            expiryDate: decodedData.exp,
            iat: decodedData.iat,
            _id: decodedData._id,
            email: decodedData.email
        }
        next()
    }
}


// allowedRoles = ['user', 'admin'] >>> array of allowed roles for a specific router send as parameter
// authUser role = 'user' 
// the role is sent with the user data from the auth mw to check if the role is allowed to perform this action or not

export const authorizationMiddleware = (allowedRoles = []) => {
    return async (req, res, next) => {
        
        const {role} = req.authUser

        const isRoleAllowed = allowedRoles.includes(role)
        console.log({role, allowedRoles, isRoleAllowed});
        
        if(!isRoleAllowed){
            return res.status(401).json({message: 'Unauthorized role'})
        }
        next()
    }
} 
