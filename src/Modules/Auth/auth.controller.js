import { Router } from "express";
import { confirmOtpService, refreshTokenService, resetOtpService, resetPasswordService, sendForgetPasswordOtpService, signInService, signOutService, signUpService } from "./Services/auth.service.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { confirmOtpSchema, resetOtpSchema, resetPasswordSchema, sendForgetPasswordOtp_Schema, signInSchema, signUpSchema } from "../../Validators/User/auth.schema.js";
import { authenticationMiddleware, checkRefreshToken } from "../../Middleware/authentication.middleware.js";



const authController = Router()


authController.post('/signUp', errorHandler(validationMiddleware(signUpSchema)), errorHandler(signUpService))

authController.patch('/confirmOtp', errorHandler(validationMiddleware(confirmOtpSchema)), errorHandler(confirmOtpService))

authController.post('/resetOtp', errorHandler(validationMiddleware(resetOtpSchema)), errorHandler(resetOtpService))

authController.post('/signIn', errorHandler(validationMiddleware(signInSchema)), errorHandler(signInService))

authController.post('/sendForgetPasswordOtp', errorHandler(validationMiddleware(sendForgetPasswordOtp_Schema)),
errorHandler(sendForgetPasswordOtpService))

authController.put('/resetPassword', errorHandler(validationMiddleware(resetPasswordSchema)), errorHandler(resetPasswordService))

authController.post('/signOut',
    errorHandler(authenticationMiddleware()),
    errorHandler(checkRefreshToken()),
    errorHandler(signOutService)
)


authController.get('/refreshToken', errorHandler(checkRefreshToken()), errorHandler(refreshTokenService))

export default authController