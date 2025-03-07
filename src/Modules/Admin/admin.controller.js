import { Router } from "express";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { systemRoles } from "../../Constants/constants.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { approveCompanySchema, banOrUnbanCompanySchema, banOrUnbanUserSchema } from "../../Validators/Admin/admin.schema.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { approveCompanyService, banOrUnbanCompanyService, banOrUnbanUserService } from "./Services/admin.service.js";


const adminController = Router()


adminController.use(errorHandler(authenticationMiddleware()), errorHandler(authorizationMiddleware(systemRoles.ADMIN)))

adminController.patch('/banUser/:userId',
    errorHandler(validationMiddleware(banOrUnbanUserSchema)),
    errorHandler(banOrUnbanUserService)
)


adminController.patch('/banCompnay/:companyId',
    errorHandler(validationMiddleware(banOrUnbanCompanySchema)),
    errorHandler(banOrUnbanCompanyService)
)

adminController.patch('/approveCompany/:companyId',
    errorHandler(validationMiddleware(approveCompanySchema)),
    errorHandler(approveCompanyService)
)


export default adminController