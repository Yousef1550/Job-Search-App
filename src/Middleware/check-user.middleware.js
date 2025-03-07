import User from "../DB/models/user.model.js"





export const checkUserAccountStatus = async (req, res, next) => {
    const {_id} = req.authUser

    const user = await User.findById(_id)
    if(!user){
        return res.status(404).json({message: 'User not found, please sign Up'})
    }
    if(user.bannedAt || user.deletedAt){
        return res.status(400).json({message: 'User account is freezed'})
    }
    next()
}