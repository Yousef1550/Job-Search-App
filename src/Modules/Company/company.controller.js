import { Router } from "express";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { addCompanyService, deleteCoverService, deleteLogoService, getCompanyJobs, searchForCompanyService, softDeleteCompanyService, updateCompanyDataService, uploadCompanyCoverService, uploadCompanyLogoService } from "./Services/company.service.js";
import { addCompanySchema, deleteCoverSchema, deleteLogoSchema, getCompanyRelatedJobsSchema, searchForCompanySchema, softDeleteCompanySchema, updateCompanyDataSchema, uploadCompanyCoverSchema, uploadCompanyLogoSchema } from "../../Validators/Company/company.schema.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { checkUserAccountStatus } from "../../Middleware/check-user.middleware.js";
import jobController from "../Job/job.controller.js";




const companyController = Router()

companyController.use(errorHandler(authenticationMiddleware()), errorHandler(checkUserAccountStatus))

companyController.post('/addCompany',
    MulterCloud(imageExtentions).single('attachment'),
    errorHandler(validationMiddleware(addCompanySchema)),
    errorHandler(addCompanyService)
)


companyController.put('/updateCompanyData/:oldCompanyName',
    errorHandler(validationMiddleware(updateCompanyDataSchema)),
    errorHandler(updateCompanyDataService)
)


companyController.patch('/softDeleteCompany/:companyName',
    errorHandler(validationMiddleware(softDeleteCompanySchema)),
    errorHandler(softDeleteCompanyService)
)


companyController.get('/searchCompany/:companyName',
    errorHandler(validationMiddleware(searchForCompanySchema)),
    errorHandler(searchForCompanyService)
)


companyController.patch('/uploadLogo/:companyId',
    MulterCloud(imageExtentions).single('logo'),
    errorHandler(validationMiddleware(uploadCompanyLogoSchema)),
    errorHandler(uploadCompanyLogoService)
)


companyController.patch('/uploadCover/:companyId',
    MulterCloud(imageExtentions).single('cover'),
    errorHandler(validationMiddleware(uploadCompanyCoverSchema)),
    errorHandler(uploadCompanyCoverService)
)

companyController.patch('/deleteLogo/:companyId',
    errorHandler(validationMiddleware(deleteLogoSchema)),
    errorHandler(deleteLogoService)
)


companyController.patch('/deleteCover/:companyId',
    errorHandler(validationMiddleware(deleteCoverSchema)),
    errorHandler(deleteCoverService)
)

//      /company/job/:companyName/getCompanyJobs
companyController.use('/job/:companyName', jobController)


companyController.get('/getAllCompanyRelatedJobs/:companyId',
    errorHandler(validationMiddleware(getCompanyRelatedJobsSchema)),
    errorHandler(getCompanyJobs)
)


export default companyController