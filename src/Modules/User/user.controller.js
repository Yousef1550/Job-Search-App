import { Router } from "express";
import { authenticationMiddleware, checkRefreshToken } from "../../Middleware/authentication.middleware.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { deleteCoverPic, deleteProfilePic, getProfileDataForAnotherUserService, getUserAccountData, softDeleteUserAccountService, updatePasswordService, updateUserProfile, uploadCoverPicService, uploadProfilePicService } from "./services/profile.service.js";
import { getProfileDataForAnotherUserSchema, updateAccountSchema, updatePasswordSchema } from "../../Validators/User/profile.schema.js";
import { signOutService } from "../Auth/Services/auth.service.js";
import { checkUserAccountStatus } from "../../Middleware/check-user.middleware.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";



const userController = Router()


userController.use(errorHandler(authenticationMiddleware()), errorHandler(checkUserAccountStatus))

userController.put('/updateUserAccount', errorHandler(validationMiddleware(updateAccountSchema)), errorHandler(updateUserProfile))

userController.get('/getUserData', errorHandler(getUserAccountData))

userController.get(
    '/getAnotherUserData/:_id',
    errorHandler(validationMiddleware(getProfileDataForAnotherUserSchema)),
    errorHandler(getProfileDataForAnotherUserService)
)

userController.patch('/softDeleteUserAccount', errorHandler(softDeleteUserAccountService))

userController.put('/updatePassword',
    errorHandler(validationMiddleware(updatePasswordSchema)),
    errorHandler(updatePasswordService),
    errorHandler(checkRefreshToken()),
    errorHandler(signOutService)
)


userController.patch('/uploadProfilePic',
    MulterCloud(imageExtentions).single('profile'),
    errorHandler(uploadProfilePicService)
)


userController.patch('/uploadCoverPic',
    MulterCloud(imageExtentions).single('cover'),
    errorHandler(uploadCoverPicService)
)


userController.patch('/deleteProfilePic',
    errorHandler(deleteProfilePic)
)


userController.patch('/deleteCoverPic',
    errorHandler(deleteCoverPic)
)

export default userController