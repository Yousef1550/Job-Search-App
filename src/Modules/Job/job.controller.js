import { Router } from "express";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { checkUserAccountStatus } from "../../Middleware/check-user.middleware.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { acceptOrRejectApplicantSchema, addJobSchema, applyToJobSchema, deleteJobSchema, getAllFilteredJobsSchema, getAllJobApplicationsSchema, getCompanyJobsSchema, updateJobSchema } from "../../Validators/Job/job.schema.js";
import { addJobService, applyToJob, deleteJobService, getAllFilteredJobs, getAllJobApplications, getCompanyJobs, updateJobService } from "./Services/job.service.js";
import { imageExtentions, systemRoles } from "../../Constants/constants.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";



const jobController = Router({mergeParams: true})

jobController.use(errorHandler(authenticationMiddleware()), errorHandler(checkUserAccountStatus))


jobController.post('/addJob',
    errorHandler(validationMiddleware(addJobSchema)),
    errorHandler(addJobService)
)

jobController.put('/updateJob/:jobId',
    errorHandler(validationMiddleware(updateJobSchema)),
    errorHandler(updateJobService)
)


jobController.delete('/deleteJob/:jobId',
    errorHandler(validationMiddleware(deleteJobSchema)),
    errorHandler(deleteJobService)
)

//      /company/job/:companyName/getCompanyJobs/:jobTitle?
jobController.get('/getCompanyJobs/:jobTitle?',
    errorHandler(validationMiddleware(getCompanyJobsSchema)),
    errorHandler(getCompanyJobs)
)



jobController.get('/getFilteredJobs',
    errorHandler(validationMiddleware(getAllFilteredJobsSchema)),
    errorHandler(getAllFilteredJobs)
)


jobController.post('/applyToJob',
    errorHandler(authorizationMiddleware(systemRoles.USER)),
    MulterCloud(imageExtentions).single('CV'),
    errorHandler(validationMiddleware(applyToJobSchema)),
    errorHandler(applyToJob)
)


jobController.patch('/acceptOrRejectApplication/:applicationId',
    errorHandler(validationMiddleware(getAllJobApplicationsSchema)),
    errorHandler(getAllJobApplications)
)



jobController.get('/getJobApplication/:jobId',
    errorHandler(validationMiddleware(getAllJobApplicationsSchema)),
    errorHandler(getAllJobApplications)
)


export default jobController